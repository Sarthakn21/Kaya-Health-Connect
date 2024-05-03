import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    symptoms:{
        type:String,
    },
    medications: [medicationSchema]
},{
    timestamps: true 
});


const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
