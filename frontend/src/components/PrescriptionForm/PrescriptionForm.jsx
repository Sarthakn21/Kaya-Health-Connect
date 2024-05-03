import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import "./PrescriptionForm.css";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const frequencyOptions = [
  "morning - (bm)",
  "morning - (am)",
  "afternoon - (bm)",
  "afternoon - (am)",
  "evening - (bm)",
  "evening - (am)",
  "night - (bm)",
  "night - (am)",
  "morning - evening",
  "morning - night",
  "afternoon - night",
  "morning - evening - night",
];

const PrescriptionForm = ({ setShowModal, onSubmit, fetchPrescription }) => {
  const { id } = useParams();
  const [medications, setMedications] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [frequency, setFrequency] = useState(null); // Changed initial value to null
  const [quantity, setQuantity] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(GlobalContext);
  const handleAddMedicine = () => {
    setMedications([...medications, { medicineName, frequency, quantity }]);
    setMedicineName("");
    setFrequency(null); // Reset frequency to null after adding medicine
    setQuantity("");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `//localhost:5000/api/prescription/add/${id}`, // Use provided patient ID
        {
          medications,
          symptoms,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        console.log("this is added prescription response", response);
        setShowModal(false);
        setOpenToast(true);
        onSubmit();
        fetchPrescription();
        enqueueSnackbar("Prescription added", { variant: "success" });
      }
    } catch (error) {
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        localStorage.clear();
        setCurrentUser(null);
        navigate("/login");
      } else if (error.response.status == 400) {
        enqueueSnackbar("Invalid field type", { variant: "info" });
      } else if (error.response.status == 404) {
        enqueueSnackbar(`${error.response.data.error}`, { variant: "error" });
      } else if (error.response.status == 403) {
        enqueueSnackbar("Invalid operation for role", { variant: "warning" });
        setShowModal(false);
      } else {
        enqueueSnackbar("An error occurred", { variant: "error" });
      }
    }
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <Modal
      open={true}
      onClose={() => setShowModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="prescription-form-container"
        style={{ backgroundColor: "#C4E4FF", borderRadius: "10px" }}
      >
        <h2 style={{ color: "#008DDA" }}>Prescription Form</h2>
        <div>
          <TextField
            id="symptoms"
            label="Symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            multiline
            maxRows={4}
            fullWidth
          />
        </div>
        <div>
          <TextField
            id="medicineName"
            label="Medicine Name"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            multiline
            maxRows={4}
            fullWidth
          />
        </div>
        <div>
        <Autocomplete
        id="frequency"
        options={frequencyOptions}
        value={frequency}
        onChange={(e, newValue) => setFrequency(newValue)}
        renderInput={(params) => <TextField multiline {...params} label="Frequency" />}
        fullWidth
      />      
        </div>
        <div>
          <TextField
            id="quantity"
            label="Quantity"
            type="number"
            value={quantity}
            multiline
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
          />
        </div>

        <button
          variant="contained"
          color="primary"
          sx={{ marginBottom: "16px" }}
          onClick={handleAddMedicine}
        >
          Add Medicine
        </button>
        <div>
          <h3>Medications</h3>
          <table>
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Frequency</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.medicineName}</td>
                  <td>{medicine.frequency}</td>
                  <td>{medicine.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={handleSubmit}>Submit</button>
        <Snackbar
          open={openToast}
          autoHideDuration={6000}
          onClose={handleCloseToast}
        >
          <Alert onClose={handleCloseToast} severity="success">
            Submitted Successfully!
          </Alert>
        </Snackbar>
      </div>
    </Modal>
  );
};

export default PrescriptionForm;
