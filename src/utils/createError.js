const createError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  throw error
}

export default createError