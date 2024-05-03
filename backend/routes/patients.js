import express from "express";
import {
  createNewPatient,
  deleteById,
  getAllPatient,
  getPatientById,
  searchPatientsByName,
  updateById,
} from "../controllers/patient.controller.js";
import doctorMiddleware from "../middleware/isDoc.js";

const router = express.Router();

router.route("/register").post(createNewPatient);
router.route("/").get(getAllPatient);
router.route("/:id").get(getPatientById);
router.route("/update/:id").put(updateById);
router.route("/delete/:id").delete(deleteById);
router.route("/search/:name").get(searchPatientsByName);

export default router;
