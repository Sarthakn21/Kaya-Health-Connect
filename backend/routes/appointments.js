import express from "express";
import {
  createAppointment,
  getAllAppointment,
  deleteAppointmentById,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.route("/").post(createAppointment);
router.route("/").get(getAllAppointment);
router.route("/delete/:id").delete(deleteAppointmentById);

export default router;
