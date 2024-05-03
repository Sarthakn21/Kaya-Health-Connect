import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useSnackbar } from "notistack";

export default function TotalPatientsCount() {
  const [totalPatients, setTotalPatients] = React.useState(0);
  const { currentUser, setCurrentUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    fetchTotalPatients();
  }, []);

  const fetchTotalPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/patients/", {
        withCredentials: true,
      });
      setTotalPatients(response.data.data.length);
    } catch (error) {
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
        localStorage.clear();
      } else {
        enqueueSnackbar("some error occured", { variant: "error" });
      }
    }
  };

  // Get the current date
  const currentDate = new Date();

  // Format the date as "Month Day, Year"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Define custom title style
  const titleStyle = {
    color: "blue",
    textAlign: "center",
    fontSize: "2rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  };

  return (
    <React.Fragment>
      <Title style={titleStyle}>Total Patients</Title>
      <br />
      <Typography
        component="p"
        variant="h4"
        sx={{
          color: "blue",
          fontSize: "100px",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
        }}
      >
        {totalPatients}
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
        {formattedDate}
      </Typography>
    </React.Fragment>
  );
}
