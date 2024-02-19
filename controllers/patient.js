const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Admin =  require('../models/admin');
const Doctor = require('../models/doctor');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Appointment  = require('../models/appointment');
const Prescription  = require('../models/prescription');


exports.registerPatient = async(req, res) => {
    try{
        const email = req.body.email;
        const existingUser = await Patient.findOne({ email: email });
        

        if(existingUser){
            return res.status(400).json("User already exists")
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newPatient = new Patient({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
            gender: req.body.gender,
            phoneNumber: req.body.phone

        })
        await newPatient.save()
        res.redirect('/patient/login')
    }catch(err){
        console.log(err)
    }

};

exports.patientLogin = (req, res)=>{
    res.render('login');
};

exports.registerPatientGet =  async (req, res) => {
    try {
        // Access the authenticated user's information
        const email = req.user.email;
        console.log(email)

        const patients = await Patient.find().exec();
        const doctors = await Doctor.find().exec();
        const patient = await Patient.findOne({ email: email });
        const appointments = await Appointment.find({ patient: patient._id }).populate('patient').populate('doctor').exec();
        const prescriptions = await Prescription.find({ email: email });
        console.log(typeof appointments);


        res.render('patient-pannel', {
            doctors,
            patients,
            email: email,
            name: patient.firstName,
            appointments, 
            prescriptions,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
};

exports.createAppointment = async(req,res)=>{
    try{
        const {doctorName,appointmentTime,appointmentDate,hiddenField} = req.body
        
        const existingPatient = await Patient.findOne({email: hiddenField});
        if(!existingPatient){
            return res.status(404).json({ error: 'Patient not found' });
        };
        const existingDoctor = await Doctor.findOne({ _id: doctorName  });
        if(!existingDoctor){
            return res.status(404).json({ error: 'Doctor not found' });
        };

        const newAppointment = await Appointment({
            doctor: existingDoctor._id,
            patient: existingPatient._id,
            date: new Date(appointmentDate +' '+ appointmentTime),
            status: 'scheduled',
        });

        await newAppointment.save();
        return res.status(201).json({ message: 'Appointment created successfully' });
        
        
        
        
        
    }catch(err){
        console.log(err)
    }
};

