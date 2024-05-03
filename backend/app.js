import express from "express";
import mongoose from "mongoose";
import patientsRouter from "./routes/patients.js";
import userRouter from "./routes/users.js";
import appointmentRoutes from "./routes/appointments.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import dotenv from "dotenv";
import authMiddleware from "./middleware/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });

app.use("/api/patients", authMiddleware, patientsRouter);
app.use("/api/users", userRouter);
app.use("/api/appointments", authMiddleware, appointmentRoutes);
app.use("/api/prescription", authMiddleware, prescriptionRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
