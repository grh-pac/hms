const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  email: { 
    type: String,
     required: true
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  disease: {
    type: String,
    default: 'nothing', 
    
  },
  allergy: {
    type: String,
    default: 'nothing', 
  },
  prescribe: {
    type: String,
    default: 'nothing', 
    
  },
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
