const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Admin =  require('../models/admin');
const Doctor = require('../models/doctor');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Appointment  = require('../models/appointment');
const Prescription  = require('../models/prescription');

const ensureAuthentication = passport.ensureAuthenticated 

router.get('/', (req, res) => {
  res.render('index', { message: "nothing" });
});
router.get('/patient/login', (req, res)=>{
    res.render('login');
})

router.post('/register/patient', async(req, res) => {
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

});


router.post('/register/doctor', async(req, res) => {
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
});

router.post('/register/admin', async(req, res) => {
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

});

router.get('/register/patient', passport.ensureAuthenticated, async (req, res) => {
    try {
        // Access the authenticated user's information
        const email = req.user.email;
        console.log(email)

        const patients = await Patient.find().exec();
        const doctors = await Doctor.find().exec();
        const user = await Patient.findOne({ email: email });
        console.log(user)

        res.render('patient-pannel', {
            doctors,
            patients,
            email: email,
            name: user.firstName 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
});

module.exports = router;
router.post('/patient/login', passport.authenticate('patient', {
    successRedirect: '/register/patient',
    failureRedirect: '/patient/login',
    failureFlash: true
}));


router.post('/appointments/create', async(req,res)=>{
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
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la déconnexion" });
        }
        res.redirect('/'); // Redirection vers la page de connexion après la déconnexion
    });
});

router.post('/doctor-login', passport.authenticate('doctor', {
        successRedirect: '/doctor-pannel',
        failureRedirect: '/',
        failureFlash: true
}));

router.get('/doctor-pannel', ensureAuthentication, async (req, res) => {
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
  
      if (appointments.length > 0) {
        const prescriptions = [];
        appointments.forEach(appointment => {
          const newPrescription = new Prescription({
            patientName: appointment.patient.firstName,
            appointmentDate: appointment.date,
            email: appointment.patient.email,
            doctor: doctorId, 
            
          });
  
          prescriptions.push(newPrescription.save());
          console.log('Prescription created for appointment ID:', appointment._id);
        });
  
        // Wait for all prescriptions to be saved before rendering the response
        await Promise.all(prescriptions);
      } else {
        console.log('No appointments found for the specified doctor ID.');
      }
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
  });
  
  module.exports = router;


// Ajoutez vos autres routes ici

module.exports = router;