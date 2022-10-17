const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StaffSchema = new mongoose.Schema({
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
        //required:[true, 'Please provide age'], 
        default:0  
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
    password:{
      type:String,
      required:[true, "Please provide a password"]
    },
    salary:{
        type:Number,
    },
    dateOfEmployment:{
        type:Date,
        default: Date.now,
    },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        //required: [true, 'User phone number required']
      },
      role:{
        type:String,
        enum:['admin','staff'],
        default:'staff'
      },

    verificationToken: String,

      isVerified: {
        type: Boolean,
        default: false,
      },
    verified: Date,

      passwordToken: {
        type: String,
      },

    passwordTokenExpirationDate: {
        type: Date,
      },
}, {timestamp:true}
);
    
StaffSchema.pre('save', async function () {
 // console.log(this.modifiedPaths());
 // console.log(this.isModified('name'));
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
    
StaffSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};
    
module.exports = mongoose.model('Staff', StaffSchema);