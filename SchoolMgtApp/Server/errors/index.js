const CustomAPIError = require('./CustomApi')
const UnauthenticatedError = require('./unAuthenticatedError')
const NotFoundError = require('./notFoundError')
const BadRequestError = require('./BadRequestError')
const UnauthorizedError = require('./unAuthorizedError')

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
}
