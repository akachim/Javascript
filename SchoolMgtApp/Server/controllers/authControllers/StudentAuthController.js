const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../../errors');
const Student = require('../../models/PeopleModel/Student');
const createTokenUser = require('../../utils/createTokenUser');
const{attachCookiesToResponse }= require('../../utils/jwt')
const Token = require('../../models/Token')
const crypto = require('crypto')



//Verify email 
const StudentVerifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body;
    const student = await Student.findOne({ email });
  
    if (!student) {
      throw new UnauthenticatedError('Verification Failed');
    }
  
    if (student.verificationToken !== verificationToken) {
      throw new UnauthenticatedError('Verification Failed');
    }
  
    (student.isVerified = true), (student.verified = Date.now());
    student.verificationToken = '';
  
    await student.save();
  
    res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
};

//login
const studentLogin = async(req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new BadRequestError('Please provide email and password');
    }

    const student = await Student.findOne({email});

    if(!student){
        throw new UnauthenticatedError('Invalid credentials');
    }

    const isPasswordMatch = await student.comparePassword(password);

    if(!isPasswordMatch){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    if(!student.isVerified){
        throw new UnauthenticatedError('Please verify your email')
    }
    
    const tokenUser = createTokenUser(student);

    //refresh token
    refreshToken ='';
    //check for existing token

    const existingToken = await Token.findOne({user:student._id});
    if(existingToken){
        const { isValid } = existingToken;
        if (!isValid){
            throw new UnauthenticatedError('Invalid credentials');
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({ res, user:tokenUser, refreshToken});
        res.status(StatusCodes.OK).json({user: tokenUser });
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user:student._id};

    await Token.create(userToken);

    attachCookiesToResponse({ res, user: tokenUser, refreshToken});
    res.status(StatusCodes.OK).json({user:tokenUser});
};

//logout
const studentLogout = async(req, res) =>{

    await Token.findOneAndDelete({ user: req.user.userId });
    
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = {
    StudentVerifyEmail,
    studentLogin,
    studentLogout,
}