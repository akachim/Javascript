
//Import the model here
const { StatusCodes } = require('http-status-codes')
const { Staff, Student } = require('../models')
const crypto = require('crypto')
const { BadRequestError } = require('../errors')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const checkPermissions = require('../utils/checkPermission')


// //Adding a new staff
// const addStaffInfo = async(req, res) =>{
//     const staff = await Staff.create({ ...req.body})
//     res.status(201).json( staff )
// }

//Get the all staff info
const getStaffInfo = async(req, res)=>{
    const staff = await Staff.find({}).select('-password')
    res.status(200).json(staff)
}

//Get a single staff
const getSingleStaff = async(req, res) =>{

    const {id:staffId} = req.params;

    const staff = await Staff.findOne({_id:staffId}).select('-password');
    
    if(!staff){
        throw new BadRequestError(`No staff with id ${staffId}`);
    }
    checkPermissions(req.user, staff._id);
    res.status(StatusCodes.OK).json({staff})
}
//Update a staff info

const updateStaffInfo = async(req, res) =>{
    res.send('Updating a staff info')
}


//get all the student info
const getStudentInfo = async(req, res) =>{
    const students  = await Student.find({}).select(('-password'))
    res.status(StatusCodes.OK).json({students})
}


//adding a new student
const addStudentInfo = async(req, res) =>{
    const{email, password} = req.body;

    const emailAlreadyExist = await Student.findOne({ email })
    if(emailAlreadyExist){
        throw new BadRequestError('Email already exists')
    }
    const verificationToken = crypto.randomBytes(40).toString('hex');


    const student = await Student.create({
        ...req.body,
        verificationToken,
    });

    const origin = 'http://localhost:3000/api/v1/student';

    await sendVerificationEmail({
        name: student.firstName,
        email: student.email,
        verificationToken: student.verificationToken,
        password: password,
        origin,
    });
    res.status(StatusCodes.CREATED).json({msg:'Student created successfully and verification email sent'});
}


//Get a single student
const getSingleStudent = async(req, res)=>{
    const {id : studentId} = req.params;
    const student = await Student.findOne({_id:studentId}).select('-password').populate('parent')
    if(!student){
        throw new BadRequestError(`no user with id ${studentId}`)
    }
    checkPermissions(req.user, student._id);
    res.status(StatusCodes.OK).json({student})
}



const updateStudentInfo = async(req, res) =>{
    res.send('Updating a single student')
}

module.exports = {
    getStaffInfo,
    getStudentInfo,
    //addStaffInfo,
    addStudentInfo,
    getSingleStaff,
    getSingleStudent,
    updateStaffInfo,
    updateStudentInfo,
}