const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Admin =  require('../models/admin');
const Doctor = require('../models/doctor');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Appointment  = require('../models/appointment');
const Prescription  = require('../models/prescription');


exports.registerAdmin =  async(req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        
        const patients = await Patient.find().exec();
        const doctors = await Doctor.find().exec();
        const appointments = await Appointment.find()
        .populate('patient')
        .populate('doctor')
        .exec();

        
        
        const existingUsername = await Admin.findOne({ username: username });


        if(existingUsername.username === username && existingUsername.password === password){
            res.render('admin-panel',{
                patients,
                doctors,
                appointments
            })     
        }
    
       
    }catch(err){
        console.log(err)
    };

}