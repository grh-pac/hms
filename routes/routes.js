const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Admin =  require('../models/admin');

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

})
router.post('/register/admin', async(req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password
        console.log(username, password)
        
        const existingUsername = await Admin.findOne({ username: username });


        if(existingUsername.username === username && existingUsername.password === password){
            
        }
        res.render('admin-panel')

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

})

// Ajoutez vos autres routes ici

module.exports = router;