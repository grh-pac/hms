const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'canceled', 'completed'], default: 'scheduled' }
  // Vous pouvez ajouter d'autres champs pertinents pour les rendez-vous
});

module.exports = mongoose.model('Appointment', appointmentSchema);
