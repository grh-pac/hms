const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  spec :{ type: String, required:true},
  docFees: { type: String, required: true}

});

module.exports = mongoose.model('Patient', patientSchema);