import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GlobalContext } from "@/context/GlobalContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useContext } from "react";
import MenuItem from "@mui/material/MenuItem";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/"></Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(GlobalContext);
  const { enqueueSnackbar } = useSnackbar();
  const Role = [
    {
      value: "Doctor",
      label: "Doctor",
    },
    {
      value: "Receptionist",
      label: "Receptionist",
    },
  ];
  const handleRoleChange = (event) => {
    console.log(event.target.value);
    setRole(event.target.value);
  };
  const variant = "success";
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          username,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const userData = response.data.data;
        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        enqueueSnackbar("Login Successful", { variant: "success" });
        navigate("/dashboard");
      } else {
        enqueueSnackbar("Login Failed", { variant: "error" });
      }
    } catch (error) {
      console.error("Error during login:", error.response.status);

      if (error.response.status == 404) {
        enqueueSnackbar("Invalid username or assigned role", {
          variant: "error",
        });
      } else if (error.response.status == 409) {
        enqueueSnackbar("invalid password", { variant: "error" });
      } else {
        enqueueSnackbar("An error occured", { variant: "error" });
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "10px",
          padding: "15px",
          marginTop:"10%",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.8)",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              multiline
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="email"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <TextField
              margin="normal"
              select
              required
              fullWidth
              name="role"
              label="Role"
              defaultValue="Doctor"
              onChange={handleRoleChange}
            >
              {Role.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
