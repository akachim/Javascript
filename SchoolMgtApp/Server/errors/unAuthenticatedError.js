const {StatusCodes, METHOD_FAILURE} = require('http-status-codes');
const CustomAPIError = require('./CustomApi');

class UnAuthenticatedError extends CustomAPIError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;

    }
}

module.exports = UnAuthenticatedError;