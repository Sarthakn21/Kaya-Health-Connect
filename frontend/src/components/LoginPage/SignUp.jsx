import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useSnackbar } from "notistack";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

function createData(username, email, role) {
  return { username, email, role };
}

const defaultTheme = createTheme();

export default function SignUp() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("Doctor");
  const [users, setUsers] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(GlobalContext);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username, email, password, role);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          username,
          email,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        enqueueSnackbar("User Registered", { variant: "success" });
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("Doctor");
        fetchUsers();
      }
    } catch (error) {
      console.log(error);

      if (error.response.status == 404) {
        enqueueSnackbar("All fields are required", {
          variant: "error",
        });
      } else if (error.response.status == 409) {
        enqueueSnackbar("Invalid password", { variant: "error" });
      } else if (error.response.status == 400) {
        enqueueSnackbar(`${error.response.data.error}`, { variant: "error" });
      }
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        navigate("/login");
        setCurrentUser(null);
      } else {
        enqueueSnackbar("An error occurred", { variant: "error" });
      }
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    console.log(event.target.value);
    setRole(event.target.value);
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        withCredentials: true,
      });
      console.log(response.data);
      setUsers(response.data.data);
    } catch (error) {
      if (error.response.status === 403) {
        enqueueSnackbar("forbidden access", {
          variant: "error",
        });
        navigate("/login");
      }
      console.error("Failed to fetch users:", error);
      enqueueSnackbar("An error occurred while fetching users", {
        variant: "error",
      });
    }
  };
  const handleDelete = async (id) => {
    try {
      console.log("this is id", id);
      await axios.delete(`http://localhost:5000/api/users/delete/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== id));
      enqueueSnackbar("user deleted successfully", { variant: "success" });
    } catch (error) {
      if (error.response.status == 403) {
        enqueueSnackbar("Invalid action for role", { variant: "warning" });
      } else if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
      } else {
        enqueueSnackbar("Unable to delete user", { variant: "error" });
      }
    }
  };
  React.useEffect(() => {
    if (currentUser?.role === "Doctor") {
      fetchUsers();
    } else {
      localStorage.clear();
      setCurrentUser(null);
      navigate("/login");
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "black" }}>
            <HowToRegIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register User
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  multiline
                  onChange={handleUsernameChange}
                  value={username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  value={email}
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
                  value={password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register User
            </Button>
          </Box>
          <Box sx={{ mt: 5, width: "100%" }}>
            <Typography variant="h6">Existing Users</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleDelete(user._id)}>
                          <DeleteIcon style={{ color: "#f44336" }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
