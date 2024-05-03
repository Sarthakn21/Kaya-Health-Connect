import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link, redirect } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useSnackbar } from "notistack";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(GlobalContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseToast = () => {
    setShowToast(false);
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
        setErrorMessage(await response.text());
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
    <div className="flex items-center px-4">
      <div className="mx-auto max-w-md w-full space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-gray-500 text-2xl dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup label="Roles">
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Receptionist">Receptionist</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Login;
