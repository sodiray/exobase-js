import { describe, expect, test } from '@jest/globals'
import { useLambdaTracer } from '../index'

describe('useLambdaTracer hook', () => {
  test('returns handler result when tracing is disabled', async () => {
    const sut = useLambdaTracer({
      tracer: () => {
        return {
          isTracingEnabled: () => false
        } as any
      }
    })
    const result = await sut(async props => ({ ...props, result: 'success' }))(
      {} as any
    )
    expect(result.services.tracer).not.toBeFalsy()
    expect(result.result).toBe('success')
  })
  test('returns handler result when tracing is enabled', async () => {
    const sut = useLambdaTracer({
      tracer: () => {
        return {
          isTracingEnabled: () => true,
          getSegment: () => ({
            addNewSubsegment: () => null,
            close: () => null
          }),
          setSegment: (seg: any) => null,
          annotateColdStart: () => null,
          addServiceNameAnnotation: () => null,
          addResponseAsMetadata: () => null
        } as any
      }
    })
    const result = await sut(async props => ({ ...props, result: 'success' }))(
      {} as any
    )
    expect(result.services.tracer).not.toBeFalsy()
    expect(result.result).toBe('success')
  })
})
