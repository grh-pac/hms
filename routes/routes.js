const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Admin =  require('../models/admin');
const Doctor = require('../models/doctor');

router.get('/', (req, res) => {
  res.render('index', { message: "nothing" });
});

router.post('/register/patient', async(req, res) => {
    try{
        const email = req.body.email;
        const existingUser = await Patient.findOne({ email: email });
        

        if(existingUser){
            return res.status(400).json("User already exists")
        }

        const newPatient = new Patient({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            gender: req.body.gender,
            phoneNumber: req.body.phone

        })
        await newPatient.save()
        res.redirect('index')
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
        const newDoctor = new Doctor({
            doctorname: req.body.doctorname,
            email: req.body.email,
            password: req.body.password,
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
        const password = req.body.password
        console.log(username, password)
        const patients = await Patient.find().exec();
        const doctors = await Doctor.find().exec();
        console.log(doctors)
        
        const existingUsername = await Admin.findOne({ username: username });


        if(existingUsername.username === username && existingUsername.password === password){
            
        }
        res.render('admin-panel',{
                        patients,
                        doctors
            })

        // if(existingUser){
        //     return res.status(400).json("User already exists")
        // }

        // const newAdmin = new Admin({
        //     username :req.body.username,
        //     password :req.body.password,

        // })
        // await newAdmin.save()
       
    }catch(err){
        console.log(err)
    }

});



// Ajoutez vos autres routes ici

module.exports = router;