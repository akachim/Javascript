const express = require('express');

const route =express.Router();

const {StudentVerifyEmail,studentLogin, studentLogout} = require('../controllers/authControllers/StudentAuthController')

const {staffLogin, StaffRegistration, StaffVerifyEmail, staffLogout}= require('../controllers/authControllers/StaffAuthController');
const { authenticateUser } = require('../middlwares/authentication');

//student
route.post('/student/login', studentLogin);
route.post('/student/verify-email', StudentVerifyEmail);
route.delete('/student/logout', authenticateUser, studentLogout);

//staff
route.post('/staff/register',StaffRegistration);
route.post('/staff/login',staffLogin);
route.post('/staff/verify-email', StaffVerifyEmail);
route.delete('/staff/logout', authenticateUser, staffLogout);

//Parent



module.exports = route;