// Framework Mapper
const useLambda = () => (func) => async (event, context) => {
  const props = parseLambdaArguments(event, context)
  const response = await func(props)
  return formatLambdaResponse(response)
}