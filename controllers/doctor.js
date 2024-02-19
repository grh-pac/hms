const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Admin =  require('../models/admin');
const Doctor = require('../models/doctor');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Appointment  = require('../models/appointment');
const Prescription  = require('../models/prescription');

exports.registerDoctor =  async(req, res) => {
    try{
        const email = req.body.email;
       
        const existingDoctor = await Doctor.findOne({ email: email });
        if(existingDoctor){
            return res.status(400).json("Doctor already exists")
        };

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newDoctor = new Doctor({
            doctorname: req.body.doctorname,
            email: req.body.email,
            password: hashedPassword,   
            spec: req.body.spec,
            docFees: req.body.docFees

        });
       
        await newDoctor.save();
        console.log('Doctor Save');
    }catch(err){
        console.log(err)
    };
};

exports.doctorPannelHandler =  async (req, res) => {
    try {
      const email = req.user.email;
      const existingDoctor = await Doctor.findOne({ email: email });
  
      if (!existingDoctor) {
        return res.status(404).send('Doctor not found');
      }
  
      const doctorId = existingDoctor._id;
      const appointments = await Appointment.find({ doctor: doctorId })
        .populate('patient')
        .populate('doctor')
        .exec();
  

      const prescriptions = await Prescription.find({ doctor: doctorId }).exec();
      console.log(prescriptions)
      res.render('doctor-pannel', {
        appointments,
        prescriptions,
        name: existingDoctor.doctorname,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
};

exports.doctorPrescription = async (req, res) => {
    try {
      const patientId = req.body.patientId;
      const doctorId = req.body.doctorId;
      const {allergy, disease, prescribe} = req.body;

      const appointment = await Appointment.findOne({patient: patientId}).populate('patient').populate('doctor').exec();

      if (!appointment) {
        return res.status(404).send('Patient and Doctor not found');
      }
      const currentDate = new Date();
      const newPrescription = new Prescription({
                patientName: appointment.patient.firstName,
                appointmentDate: currentDate.toString(),
                email: appointment.patient.email,
                doctor: appointment.doctor._id, 
                allergy: allergy,
                prescribe: prescribe,
                disease:disease,
                
              });
        await newPrescription.save()
      
      res.redirect('/doctor-pannel')
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
};

exports.prescriptionForm = async(req,res)=>{

    const doctorId = req.params.doctorId;
    const patientId = req.params.patientId;
   
  

    res.render('prescription', {doctorId, patientId});

};