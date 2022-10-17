const { StatusCodes } = require('http-status-codes')
const {BadRequestError, UnauthenticatedError}= require('../../errors')
const {Staff} = require('../../models')
const Token = require('../../models/Token')
const crypto = require('crypto')
const sendVerificationEmail = require('../../utils/sendVerificationEmail')
const createTokenUser = require('../../utils/createTokenUser')
const {attachCookiesToResponse, isTokenValid, createJWT} = require('../../utils/jwt')

const StaffRegistration = async(req, res)=>{
    const {email, password, firstName, lastName} = req.body

    const emailAlreadyExist = await Staff.findOne({email})
    if(emailAlreadyExist){
        throw new BadRequestError('Email already exist')
    }
    const isFirstStaff = (await Staff.countDocuments({})) === 0;
    
    const role =isFirstStaff? 'admin':'staff'

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const staff = await Staff.create({
        firstName,
        lastName,
        email,
        password,
        role,
        verificationToken,

    });
    const origin = 'http://localhost:3000/api/v1/auth/staff';

    await sendVerificationEmail({
        name:staff.firstName,
        email:staff.email,
        verificationToken:staff.verificationToken,
        password:password,
        origin:origin
    });
    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify account',
    });
};

//Verify email 
const StaffVerifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body;
    const staff = await Staff.findOne({ email });
  
    if (!staff) {
      throw new UnauthenticatedError('Verification Failed no user');
    }
  
    if (staff.verificationToken !== verificationToken) {
      throw new UnauthenticatedError('Verification Failed token not valid');
    }
  
    (staff.isVerified = true), (staff.verified = Date.now());
    staff.verificationToken = '';
  
    await staff.save();
  
    res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
};


//login
const staffLogin = async(req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new BadRequestError('Please provide email and password');
    }

    const staff = await Staff.findOne({email});

    if(!staff){
        throw new UnauthenticatedError('Invalid credentials');
    }

    const isPasswordMatch = await staff.comparePassword(password);

    if(!isPasswordMatch){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    if(!staff.isVerified){
        throw new UnauthenticatedError('Please verify your email')
    }
    
    const tokenUser = createTokenUser(staff);

    //refresh token
    refreshToken ='';
    //check for existing token

    const existingToken = await Token.findOne({user:staff._id});

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
    const userToken = { refreshToken, ip, userAgent, user:staff._id};

    await Token.create(userToken);

    attachCookiesToResponse({ res, user: tokenUser, refreshToken});
    
    res.status(StatusCodes.OK).json({user:tokenUser});
};

const staffLogout = async(req, res) =>{

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
      

module.exports ={
    StaffVerifyEmail,
    StaffRegistration,
    staffLogin,
    staffLogout,
}