// auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get the token from the request headers
    console.log(req);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await User.findById(decoded?._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    // console.log("in catch block authmiddleware");
    res.status(401).json({ message: error?.message || "Unauthorized" });
  }
};

export default authMiddleware;
