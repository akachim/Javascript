const {StatusCodes} = require('http-status-codes')
const errorHandleMiddleware = (err, req, res, next) =>{
    let customError ={
        //set defualt
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message || 'Something went wrong try again'
    }

//if (err is instanceof CustomAPIError){
    //return res.status(err.statuscode).json()
//}
//DEFINE THE ERRORS FOR THE DATABASE
if (err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors)
    .map((item ) => item.message)
    .join(',')
    customError.statusCode=400
}

if(err.name === 'CastError'){
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
}
if(err.code && err.code === 11000){
    customError.msg = `Duplicate value entered for ${Object.keys}`
}
return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports = errorHandleMiddleware