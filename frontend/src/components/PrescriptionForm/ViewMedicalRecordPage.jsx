import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PrescriptionForm from "./PrescriptionForm";
import SvgIcon from "@mui/material/SvgIcon";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

const ViewMedicalRecordPage = () => {
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    mobileNumber: "",
    age: "",
    weight: "",
    gender: "",
    address: "",
  });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const { currentUser, setCurrentUser } = useContext(GlobalContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchPrescription = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/prescription/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.statusCode == 200) {
        const prescriptions = response.data.data.map((record) => ({
          ...record,
          date: formatDate(record.createdAt), // Format date here
        }));
        setMedicalRecords(prescriptions);
        if (prescriptions.length === 0) {
          enqueueSnackbar("No prescription found for this patient", {
            variant: "info",
          });
        }

        fetchPatientDetails();
      }
    } catch (error) {
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        navigate("/login");
        setCurrentUser(null);
      } else if (error.response.status == 404) {
        enqueueSnackbar("Invalid patient", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("An error occurred", { variant: "error" });
      }
    }
  };

  const fetchPatientDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/patients/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.statusCode == 200) {
        const { name, contactNumber, age, weight, gender, address } =
          response.data.data;
        setPatientDetails({
          name,
          mobileNumber: contactNumber,
          age,
          weight,
          gender,
          address,
        });
      } else {
        console.error("Failed to fetch patient details:", response.statusText);
      }
    } catch (error) {
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
      } else if (error.response.status == 404) {
        enqueueSnackbar("Patient not found", { variant: "error" });
      } else {
        enqueueSnackbar("An error occurred", { variant: "error" });
      }
    }
  };

  useEffect(() => {
    const fetchPrescriptionAndPatientDetails = async () => {
      await fetchPrescription();
    };

    fetchPrescriptionAndPatientDetails();
  }, []);

  // Handle delete record
  const handleDeleteRecord = async (recordId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/prescription/delete/${recordId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.statusCode == 200) {
        const updatedRecords = medicalRecords.filter(
          (record) => record._id !== recordId
        );
        setMedicalRecords(updatedRecords);
        enqueueSnackbar("Record deleted", { variant: "success" });
      }
    } catch (error) {
      if (error.response.status == 403) {
        enqueueSnackbar("Invalid action for role", { variant: "warning" });
      } else if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
      } else if (error.response.status == 404) {
        enqueueSnackbar("No record found", { variant: "info" });
      } else {
        enqueueSnackbar("An error occurred while deleting", {
          variant: "error",
        });
      }
    }
  };

  // Function to format date as DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        paddingLeft: "10%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: "20px",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "2rem", color: "#074173" }}>
            Name: {patientDetails.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.5rem", color: "#074173" }}
          >
            Mobile Number: {patientDetails.mobileNumber}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.5rem", color: "#074173" }}
          >
            Age: {patientDetails.age}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontSize: "1.5rem", color: "#074173" }}
          >
            Weight: {patientDetails.weight}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.5rem", color: "#074173" }}
          >
            Gender: {patientDetails.gender}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.5rem", color: "#074173" }}
          >
            Address: {patientDetails.address}
          </Typography>
        </Box>
      </Box>
      {currentUser?.role === "Doctor" && (
        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: "16px" }}
          onClick={() => setShowModal(true)}
        >
          Add New Record
        </Button>
      )}
      <hr
        style={{
          width: "100%",
          border: "1px solid black",
          marginBottom: "20px",
        }}
      />
      <Typography
        variant="h1"
        sx={{
          fontFamily: "sans-serif",
          fontSize: "2rem",
          color: "#074173",
          marginBottom: "20px",
        }}
      >
        Records History
      </Typography>

      {medicalRecords
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((record) => (
          <Box
            key={record._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "16px",
              paddingLeft: "5%",
              paddingRight: "5%",
            }}
          >
            <Card
              sx={{
                flexBasis: "53%",
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                position: "relative",
                backgroundColor: "#F5F5F5",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#008DDA",
                    fontSize: "2rem",
                    alignItems: "center",
                  }}
                >
                  Symptoms
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.5rem" }}>
                  {record.symptoms}
                </Typography>
              </CardContent>
              <Typography
                variant="h6"
                sx={{ position: "absolute", bottom: "10px", right: "10px" }}
              >
                Date: {record.date}
              </Typography>
              <SvgIcon
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "8px",
                  width: "3rem",
                  height: "3rem",
                }}
              >
                <path
                  fill="currentColor"
                  d="M4 4v10h2v-4h2l5.41 5.41L9.83 19l1.41 1.41l3.59-3.58l3.58 3.58L19.82 19l-3.58-3.59l3.58-3.58l-1.41-1.42L14.83 14l-4-4H11a3 3 0 0 0 3-3a3 3 0 0 0-3-3zm2 2h5a1 1 0 0 1 1 1a1 1 0 0 1-1 1H6z"
                ></path>
              </SvgIcon>
            </Card>
            <Card
              sx={{
                flexBasis: "45%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#F5F5F5",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#008DDA", fontSize: "2rem" }}
                  >
                    Medications
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <b>Medicine Name</b>
                          </TableCell>
                          <TableCell>
                            <b>Frequency</b>
                          </TableCell>
                          <TableCell>
                            <b>Quantity</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {record.medications.map((medicine, index) => (
                          <TableRow key={index}>
                            <TableCell>{medicine.medicineName}</TableCell>
                            <TableCell>{medicine.frequency}</TableCell>
                            <TableCell>{medicine.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {currentUser?.role === "Doctor" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                        padding: "10px",
                      }}
                    >
                      <div>
                        <IconButton
                          onClick={() => handleDeleteRecord(record._id)}
                          sx={{ marginRight: "8px" }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </div>
                      <div style={{ marginLeft: "16px" }}>
                        <IconButton
                          component={Link}
                          to={`/Print/${record._id}`}
                        >
                          <PrintIcon color="primary" />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      {showModal && (
        <PrescriptionForm
          setShowModal={setShowModal}
          onSubmit={() => setShowModal(false)}
          fetchPrescription={fetchPrescription}
        />
      )}
    </Box>
  );
};

export default ViewMedicalRecordPage;
