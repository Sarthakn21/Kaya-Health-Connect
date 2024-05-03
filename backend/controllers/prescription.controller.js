import Patient from "../models/patient.js";
import Prescription from "../models/Prescription.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

//function to get all prescription
//method : Get
//api-url: http://localhost:5000/api/prescription/
const getAllPrescription = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res
      .status(200)
      .json(new ApiResponse(200, prescriptions, "Fetched all prescriptions"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

//function to get all prescription by id
//method : Get
//api-url: http://localhost:5000/api/prescription/:id
const getPrecrptionById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    //check if patient exist
    if (!patient) {
      throw new ApiError(404, "No such patient");
    }
    const prescriptions = await Prescription.find({ patientId: patientId });
    res
      .status(200)
      .json(
        new ApiResponse(200, prescriptions, "Fetched prescription successful")
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

//function to add prescription to particular patient
//method : Post
//api-url: http://localhost:5000/api/prescription/add/:id
const addPrescription = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { medications } = req.body;
    const { symptoms } = req.body;

    if (!symptoms || !medications || !patientId || medications.length == 0) {
      throw new ApiError(404, "Fill all details");
    }
    // Check if the patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "User not found");
    }

    // Create the prescription
    const prescription = await Prescription.create({
      patientId,
      symptoms,
      medications,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Prescription added successfully"));
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    } else {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
};

//function to delete particular prescription by id
//method : Delete
//api-url:http://localhost:5000/api/prescription/delete/:id
const deletePrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the prescription exists
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      throw new ApiError(404, "No prescription found to id");
    }
    await prescription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, "Prescription deleted successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
//function to get particular prescription by id
//method : Get
//api-url:http://localhost:5000/api/prescription/get/:id
const getPbyId = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the prescription exists
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      throw new ApiError(404, "No prescription found to id");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { prescription },
          "Prescription fetched successfully"
        )
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
export {
  getAllPrescription,
  getPrecrptionById,
  addPrescription,
  deletePrescriptionById,
  getPbyId,
};
