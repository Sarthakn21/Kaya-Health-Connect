import express from "express";
import dotenv from "dotenv";
import {
  changeCurrentPassword,
  deleteById,
  getAllUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyRefreshToken } from "../middleware/checkRefreshtoken.js";
import authMiddleware from "../middleware/auth.js";
import doctorMiddleware from "../middleware/isDoc.js";
import receptionMiddleware from "../middleware/isReceptionist.js";
dotenv.config();

const router = express.Router();

router.route("/").get(authMiddleware, doctorMiddleware, getAllUser);
router.route("/register").post(authMiddleware, doctorMiddleware, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/delete/:id").delete(authMiddleware, doctorMiddleware, deleteById);
router.route("/changePassword").post(authMiddleware, changeCurrentPassword);
router.route("/refreshAccessToken").post(verifyRefreshToken, refreshAccessToken);
router.route("/getCurrent").get(authMiddleware,getCurrentUser)
export default router;
