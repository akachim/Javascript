const express = require('express');

const router= express.Router();

const {
    getStaffInfo,
    getStudentInfo,
    //addStaffInfo,
    addStudentInfo,
    getSingleStaff,
    getSingleStudent,
    updateStaffInfo,
    updateStudentInfo,
} = require('../controllers/peopleController')
const { authenticateUser, authorizePermissions } = require('../middlwares/authentication')


router.route('/staff').get(authenticateUser, authorizePermissions('admin'), getStaffInfo)//.post(adminAddStaffInfo)

router.route('/student').get(authenticateUser, authorizePermissions('admin'), getStudentInfo).post(authenticateUser, authorizePermissions('admin'), addStudentInfo)

router.route('/staff/:id').get(authenticateUser, getSingleStaff).patch(authenticateUser,updateStaffInfo)

router.route('/student/:id').get(authenticateUser, getSingleStudent).patch(authenticateUser, updateStudentInfo)

module.exports =router