const mongoose = require('mongoose')

const ParentSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, 'please provide a first name'],
        unique:true,
        minLength:3,
    },
    lastName:{
        type:String,
        required:[true, 'please provide a last name'],
        minLength:3,
    },
    age:{
        type:Number,
        required:[true, 'Please provide age'],   
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: true,
    },
}, {timestamps:true});




module.exports = mongoose.model('Parent', ParentSchema)