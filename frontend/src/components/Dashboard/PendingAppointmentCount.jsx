import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
export default function PendingAppointmentCount() {
  const [pendingAppointments, setPendingAppointments] = React.useState(0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser, setCurrentUser } = useContext(GlobalContext);

  React.useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointments/",
        {
          withCredentials: true,
        }
      );
      setPendingAppointments(response.data.data.length);
    } catch (error) {
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
        localStorage.clear();
      }
    }
  };

  const currentDate = new Date();

  // Format the date as "Month Day, Year"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <React.Fragment>
      <Title>Pending Appointments</Title>
      <Typography
        component="p"
        variant="h4"
        sx={{
          color: "blue",
          paddingTop: "23px",
          fontSize: "100px",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
        }}
      >
        {pendingAppointments}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{
          flex: 1,
          fontSize: "20px",
          textAlign: "center",
          fontStyle: "italic",
          color: "gray",
        }}
      >
        {formattedDate} {/* Display the formatted date */}
      </Typography>
    </React.Fragment>
  );
}
