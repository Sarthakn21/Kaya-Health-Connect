import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    patientMobileNumber: {
        type: String,
        required: true,
    },
    patientAge: {
        type: Number,
        required: true,
        min: 0 
    },
    patientGender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
}, {
    timestamps: true 
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
