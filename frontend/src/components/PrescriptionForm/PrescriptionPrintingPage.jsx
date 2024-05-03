import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useSnackbar } from "notistack";
const PrescriptionPrintingPage = () => {
  const [patientData, setPatientData] = useState(null);
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);
  const componentRef = useRef();
  const { id } = useParams();
  const { setCurrentUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear();
    return `${day}-${month < 10 ? "0" + month : month}-${year}`;
  };

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const prescriptionResponse = await axios.get(
          `http://localhost:5000/api/prescription/get/${id}`,
          {
            withCredentials: true,
          }
        );
        if (prescriptionResponse.status === 200) {
          setMedications(
            prescriptionResponse.data.data.prescription.medications
          );
          const patientId =
            prescriptionResponse.data.data.prescription.patientId;
          fetchPatientData(patientId);
        } else {
          throw new Error("Failed to fetch medications data");
        }
      } catch (error) {
        setError(error.message);
        if (error.response.status == 401) {
          enqueueSnackbar("Invalid access", {
            variant: "error",
          });
          setCurrentUser(null);
          navigate("/login");
          localStorage.clear();
        } else if (error.response.status == 404) {
          enqueueSnackbar("Invalid patient", {
            variant: "error",
          });
        } else {
          enqueueSnackbar(`${error}`, { variant: "error" });
        }
      }
    };
    fetchPrescriptionData();
  }, [id]);

  const fetchPatientData = async (patientId) => {
    try {
      const patientResponse = await axios.get(
        `http://localhost:5000/api/patients/${patientId}`,
        {
          withCredentials: true,
        }
      );
      if (patientResponse.status === 200) {
        setPatientData(patientResponse.data.data);
      } else {
        throw new Error("Failed to fetch patient data");
      }
    } catch (error) {
      setError(error.message);
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
        localStorage.clear();
      } else if (error.response.status == 404) {
        enqueueSnackbar("Patient not found", { variant: "error" });
      } else {
        enqueueSnackbar("An error occurred", { variant: "error" });
      }
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Prescription",
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Box
        ref={componentRef}
        id="printBox"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "30px",
        }}
      >
        <div
          className="prescription"
          style={{ lineHeight: 1, position: "relative" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h1
              style={{
                fontSize: "3rem",
                color: "#008DDA",
                textAlign: "center",
              }}
            >
              KAYA CLINIC
            </h1>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="5em"
            height="5em"
            viewBox="0 0 24 24"
            style={{ position: "absolute", top: 10, left: 0 }}
          >
            <path
              fill="currentColor"
              d="M4 4v10h2v-4h2l5.41 5.41L9.83 19l1.41 1.41l3.59-3.58l3.58 3.58L19.82 19l-3.58-3.59l3.58-3.58l-1.41-1.42L14.83 14l-4-4H11a3 3 0 0 0 3-3a3 3 0 0 0-3-3zm2 2h5a1 1 0 0 1 1 1a1 1 0 0 1-1 1H6z"
            ></path>
          </svg>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "70vw",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "2rem",
                  marginBottom: "20px",
                  paddingTop: "12%",
                }}
              >
                {" "}
                Dr. Abhijit Bubane
              </p>
              <p style={{ fontSize: "0.8rem" }}>
                M.D MED. (AYU.), PH.D(SCH.), D.E.M.S.
              </p>
            </div>
            <div>
              <p style={{ marginBottom: "10px" }}>Date: {getCurrentDate()}</p>
              <p style={{ marginBottom: "10px" }}>Opening Time :</p>
              <p style={{ marginBottom: "10px" }}>Morning: 10 to 1.30</p>
              <p style={{ marginBottom: "10px" }}>Evening: 6 to 9.30</p>
            </div>
          </div>

          <hr />
          {patientData && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "70vw",
              }}
            >
              <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                <p style={{ marginBottom: "10px" }}>
                  Patient Name: {patientData.name}
                </p>
                <p style={{ marginBottom: "10px" }}>
                  Mobile Number: {patientData.contactNumber}
                </p>
                <p style={{ marginBottom: "10px" }}>
                  Address: {patientData.address}
                </p>
              </div>
              <div
                style={{
                  marginBottom: "20px",
                  marginTop: "20px",
                  textAlign: "left",
                }}
              >
                <p style={{ marginBottom: "10px" }}>
                  Gender: {patientData.gender}
                </p>
                <p style={{ marginBottom: "10px" }}>
                  Weight: {patientData.weight}
                </p>
                <p style={{ marginBottom: "10px" }}>Age: {patientData.age}</p>
              </div>
            </div>
          )}
          <hr />
          {/* Medication table */}
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
          <hr />
        </div>
      </Box>
      <button style={{ marginTop: "20px" }} onClick={handlePrint}>
        Print
      </button>
    </>
  );
};

export default PrescriptionPrintingPage;
