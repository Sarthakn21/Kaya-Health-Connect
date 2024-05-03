import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select"; // Import Select component
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem component
import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { Navigate, useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "none",
    padding: theme.spacing(2),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientGender: "Male", // Modified state to store gender
    patientAge: 0,
    patientMobileNumber: "",
    reason: "",
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setCurrentUser } = useContext(GlobalContext);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("unable to fetch appointment", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleClick = (row) => {
    console.log(row);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log("this is delete response", response);
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      setAppointments(
        appointments.filter((appointment) => appointment._id !== id)
      );
      enqueueSnackbar("Appointment deleted", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to delete appointment", { variant: "error" });
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };
  const handleSubmitOnEnter = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const age = parseInt(newAppointment.patientAge);

      if (isNaN(age)) {
        throw new Error("Age must be a number");
      }

      const response = await axios.post(
        "http://localhost:5000/api/appointments/",
        {
          patientAge: age,
          patientMobileNumber: newAppointment.patientMobileNumber,
          patientName: newAppointment.patientName,
          reason: newAppointment.reason,
          patientGender: newAppointment.patientGender, // Modified to use patientGender state
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Appointment added", { variant: "success" });
      }

      fetchAppointments();

      setNewAppointment({
        patientName: "",
        patientGender: "", // Reset gender state
        patientAge: "",
        patientMobileNumber: "",
        reason: "",
      });

      setOpenModal(false);
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
        localStorage.clear();
      } else if (error.response.status == 400) {
        enqueueSnackbar("Please enter all Fields", { variant: "error" });
      } else {
        enqueueSnackbar("An error occured", { variant: "error" });
      }
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="left">Patient Name</StyledTableCell>
              <StyledTableCell align="left">Gender</StyledTableCell>
              <StyledTableCell align="left">Age</StyledTableCell>
              <StyledTableCell align="left">Contact</StyledTableCell>
              <StyledTableCell align="left">Reason</StyledTableCell>
              <StyledTableCell align="left">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((row, index) => (
              <StyledTableRow
                key={row._id}
                onClick={() => {
                  handleClick(row);
                }}
              >
                <StyledTableCell align="left">{index + 1}</StyledTableCell>
                <StyledTableCell align="left">
                  {row.patientName}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.patientGender}
                </StyledTableCell>
                <StyledTableCell align="left">{row.patientAge}</StyledTableCell>
                <StyledTableCell align="left">
                  {row.patientMobileNumber}
                </StyledTableCell>
                <StyledTableCell align="left">{row.reason}</StyledTableCell>
                <StyledTableCell align="left">
                  <Fab
                    color=""
                    size="small"
                    onClick={() => handleDelete(row._id)}
                  >
                    <CheckIcon style={{ color: "green" }} />
                  </Fab>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={handleOpenModal}
      >
        <AddIcon />
      </Fab>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        BackdropProps={{
          sx: {
            backdropFilter: "blur(2px)", // Adjust the blur intensity as needed
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "#DFF5FF",
            border: "2px solid #000",
            borderRadius: "15px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="modal-title" style={{ color: "#008DDA" }}>
            Add New Appointment
          </h2>
          <form onSubmit={handleSubmit} onKeyDown={handleSubmitOnEnter}>
            <TextField
              fullWidth
              variant="outlined"
              label="Patient Name"
              name="patientName"
              value={newAppointment.patientName}
              onChange={handleInputChange}
              multiline
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Gender"
              name="patientGender"
              value={newAppointment.patientGender}
              onChange={handleInputChange}
              margin="normal"
              multiline
            >
              <MenuItem defaultChecked value="Male">
                Male
              </MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Age"
              name="patientAge"
              onChange={handleInputChange}
              margin="normal"
              type="number"
              multiline
            />
            <TextField
              fullWidth
              label="Contact"
              name="patientMobileNumber"
              value={newAppointment.patientMobileNumber}
              onChange={handleInputChange}
              margin="normal"
              multiline
            />
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={newAppointment.reason}
              onChange={handleInputChange}
              margin="normal"
              multiline
            />
            <Button type="submit" variant="contained" color="primary">
              Add Appointment
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
