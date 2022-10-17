const {StatusCodes, METHOD_FAILURE} = require('http-status-codes');
const CustomAPIError = require('./CustomApi');

class BadREquestError extends CustomAPIError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;

    }
}

module.exports = BadREquestError;