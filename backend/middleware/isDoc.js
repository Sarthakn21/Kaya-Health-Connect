import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const doctorMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "Doctor") {
      return res
        .status(403)
        .json({ message: "Forbidden: Access denied for this role" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};


export default doctorMiddleware;
