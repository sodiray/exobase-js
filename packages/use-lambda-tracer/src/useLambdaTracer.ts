import { Tracer } from '@aws-lambda-powertools/tracer'
import type { NextFunc, Props } from '@exobase/core'
import type { Segment } from 'aws-xray-sdk-core'
import { isFunction, tryit } from 'radash'

export type UseLambdaTracerOptions<TProps extends Props = Props> = {
  captureResponse?: boolean
  tracer?: Tracer | ((props: TProps) => Promise<Tracer> | Tracer)
}

export async function withLambdaTracer<TProps extends Props>(
  func: NextFunc<
    TProps & { services: TProps['services'] & { tracer: Tracer } }
  >,
  options: UseLambdaTracerOptions<TProps> | undefined,
  props: TProps
) {
  const tracer = !options?.tracer
    ? new Tracer()
    : isFunction(options.tracer)
    ? await options.tracer(props)
    : options.tracer

  const enabled = tracer.isTracingEnabled()

  if (!enabled)
    return await func({
      ...props,
      services: {
        ...props.services,
        tracer
      }
    })

  const segment = tracer.getSegment()

  const close = () => {
    const subsegment = tracer.getSegment()
    subsegment.close()
    tracer.setSegment(segment as Segment)
  }

  tracer.setSegment(segment.addNewSubsegment(`## ${process.env._HANDLER}`))
  tracer.annotateColdStart()
  tracer.addServiceNameAnnotation()

  const [err, response] = await tryit(func)({
    ...props,
    services: {
      ...props.services,
      tracer
    }
  })

  if (err) {
    tracer.addErrorAsMetadata(err as Error)
    close()
    throw err
  }

  if (options?.captureResponse ?? true) {
    tracer.addResponseAsMetadata(response, process.env._HANDLER)
  }
  close()

  return response
}

export const useLambdaTracer =
  <TProps extends Props>(options?: UseLambdaTracerOptions<TProps>) =>
  (
    func: NextFunc<TProps>
  ): NextFunc<TProps & { services: TProps['services'] & { tracer: Tracer } }> =>
  props =>
    withLambdaTracer(func, options, props)
