const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Admin =  require('../models/admin');
const Doctor = require('../models/doctor');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Appointment  = require('../models/appointment');
const Prescription  = require('../models/prescription');

const patientController = require('../controllers/patient');
const doctorController = require('../controllers/doctor');
const adminController = require('../controllers/admin');

const ensureAuthentication = passport.ensureAuthenticated 

router.get('/', (req, res) => {
  res.render('index', { message: "nothing" });
});
router.get('/patient/login', patientController.patientLogin);

router.post('/register/patient',patientController.registerPatient );


router.post('/register/doctor',doctorController.registerDoctor);

router.post('/register/admin', adminController.registerAdmin);

router.get('/register/patient', passport.ensureAuthenticated, patientController.registerPatientGet);


router.post('/patient/login', passport.authenticate('patient', {
    successRedirect: '/register/patient',
    failureRedirect: '/patient/login',
    failureFlash: true
}));


router.post('/appointments/create', patientController.createAppointment);

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

router.get('/doctor-pannel', ensureAuthentication, doctorController.doctorPannelHandler);

router.get('/doctor/pres/:doctorId/:patientId', doctorController.prescriptionForm);

router.post('/doctor/pres/', doctorController.doctorPrescription);





module.exports = router;