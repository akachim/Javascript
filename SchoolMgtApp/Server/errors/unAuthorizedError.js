const {StatusCodes, METHOD_FAILURE} = require('http-status-codes');
const CustomAPIError = require('./CustomApi');

class UnAuthorizedError extends CustomAPIError{
    constructor(message){
        super(message);
        this.StatusCodes= StatusCodes.FORBIDDEN

    }
}

module.exports = UnAuthorizedError;