const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    refreshToken:{type:String, required:true },
    ip:{type:String, required:true},
    userAgent:{ type:String, required:true},
    isValid:{type:String, default:true},
    user:{
        type:mongoose.Types.ObjectId,
        references:{type:[mongoose.Types.ObjectId],refPath:'people'},
        people:{type:String, enum:['staffs','students','parents']},
        required:true,
    },
},
{ timestamps:true }
);

module.exports=mongoose.model('Token', TokenSchema);