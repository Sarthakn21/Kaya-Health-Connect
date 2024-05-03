import Patient from "../models/patient.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//fnctiont to create new patient
//method : Post
//api-url:http://localhost:5000/api/patients/register
const createNewPatient = async (req, res) => {
  try {
    console.log("in create patient");
    const { name, contactNumber, age, weight, gender, Dob, address } = req.body;
    if (
      !name ||
      !contactNumber ||
      !age ||
      !weight ||
      !gender ||
      !Dob ||
      !address
    ) {
      throw new ApiError(400, "All fields are required to create new patient");
    }

    const patient = await Patient.create({
      name,
      contactNumber,
      age,
      weight,
      gender,
      Dob,
      address,
    });
    console.log(patient);

    res
      .status(201)
      .json(new ApiResponse(201, { patient }, "Patient created successfully"));
  } catch (error) {
    if (error.name == "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ message: "Validation error", errors });
    } else {
      res
        .status(error.statusCode || 500)
        .json({ message: "Failed to create patient", error: error.message });
    }
  }
};

//Function to get all patients
//method : Get
//api-url: http://localhost:5000/api/patients
const getAllPatient = async (req, res) => {
  try {
    const patients = await Patient.find();
    res
      .status(200)
      .json(
        new ApiResponse(200, patients, "fetched all patients successfully")
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: "Failed to retrieve patients", error });
  }
};

//Function to get patient by id
//method : Get
//api-url: http://localhost:5000/api/patients/:id
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    // const patient = await Patient.findOne({ patientId: id });

    if (!patient) {
      throw new ApiError(404, "No patient found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, patient, "fetched patient successfully"));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to Retrieve Patient", error: error.message });
  }
};

//Function to update patients by id
//method : put
//api-url: http://localhost:5000/api/patients/update/:id
const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      contactNumber,
      age,
      weight,
      gender,
      Dob,
      address,
      bloodGroup,
    } = req.body;
    if (
      !name ||
      !contactNumber ||
      !age ||
      !weight ||
      !gender ||
      !Dob ||
      !address ||
      !bloodGroup
    ) {
      throw new ApiError(400, "All fields are required to update patient");
    }
    const patient = await Patient.findById(id);

    if (!patient) {
      throw new ApiError(404, "No patient found");
    }
    patient.name = name;
    patient.contactNumber = contactNumber;
    patient.age = age;
    patient.weight = weight;
    patient.gender = gender;
    patient.Dob = Dob;
    patient.address = address;
    patient.bloodGroup = bloodGroup;

    await patient.save();

    return res
      .status(200)
      .json(new ApiResponse(200, patient, "Patient updated successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: "Failed to Update Patient Details",
      error: error.message,
    });
  }
};

//Function to delete patient by id
//method : Delete
//api-url: http://localhost:5000/api/patients/delete/:id
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    await patient.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, "Patient deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: "Unable to  Delete Patient", error: error.message });
  }
};

// Add a new route for patient search
// Method: GET
// Endpoint: /api/patients/search
const searchPatientsByName = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      throw new ApiError(400, "Please provide a name to search for");
    }
    const patient = await Patient.find({
      name: { $regex: new RegExp(name, "i") },
    });
    res
      .status(200)
      .json(new ApiResponse(200, patient, "Patients found successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: "Failed to search patients", error: error.message });
  }
};

export {
  createNewPatient,
  getAllPatient,
  getPatientById,
  updateById,
  deleteById,
  searchPatientsByName,
};
