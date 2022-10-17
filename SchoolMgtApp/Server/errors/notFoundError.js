const {StatusCodes, METHOD_FAILURE} = require('http-status-codes');
const CustomAPIError = require('./CustomApi');

class NotFounError extends CustomAPIError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;

    }
}

module.exports = NotFounError;