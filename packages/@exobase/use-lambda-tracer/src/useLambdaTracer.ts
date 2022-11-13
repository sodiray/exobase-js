import { Tracer } from '@aws-lambda-powertools/tracer'
import type { Handler, Props } from '@exobase/core'
import type { Segment, Subsegment } from 'aws-xray-sdk-core'
import { tryit } from 'radash'

export type UseLambdaTracerOptions = {
  serviceName?: string
  captureResponse?: boolean
  tracer?: Tracer
}

export async function withLambdaTracer<TProps extends Props>(
  func: Handler<TProps & { services: TProps['services'] & { tracer: Tracer } }>,
  options: UseLambdaTracerOptions | undefined,
  tracer: Tracer,
  props: TProps
) {
  const enabled = tracer.isTracingEnabled()
  const segment: Subsegment | Segment | null = enabled
    ? tracer.getSegment()
    : null

  const close = () => {
    const subsegment = tracer.getSegment()
    subsegment.close()
    tracer.setSegment(segment as Segment)
  }

  if (enabled && segment) {
    tracer.setSegment(segment.addNewSubsegment(`## ${process.env._HANDLER}`))
    tracer.annotateColdStart()
    tracer.addServiceNameAnnotation()
  }

  const [err, response] = await tryit(func)({
    ...props,
    services: {
      ...props.services,
      tracer
    }
  })

  if (err) {
    if (enabled) {
      tracer.addErrorAsMetadata(err as Error)
      close()
    }
    throw err
  }

  if (enabled) {
    if (options?.captureResponse ?? true) {
      tracer.addResponseAsMetadata(response, process.env._HANDLER)
    }
    close()
  }

  return response
}

export const useLambdaTracer: <TProps extends Props>(
  options?: UseLambdaTracerOptions
) => (
  func: Handler<TProps>
) => Handler<TProps & { services: TProps['services'] & { tracer: Tracer } }> =
  (
    { captureResponse = true, serviceName, tracer }: UseLambdaTracerOptions = {
      captureResponse: true
    }
  ) =>
  func => {
    const tr = tracer ?? new Tracer({ serviceName })
    return props => withLambdaTracer(func, { captureResponse }, tr, props)
  }
