import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.js";

const verifyRefreshToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedUser = jwt.verify(token, process.env.REFRESH_SECRET_KEY);

    const user = await User.findById(decodedUser?._id).select("-password");

    if (!user) throw new ApiError(401, "Invalid Access Token");
    req.user = user;
    next();
  } catch (error) {
       return res
         .status(error.statusCode || 500)
         .json({ error: error.message });
  }
};

export { verifyRefreshToken };
