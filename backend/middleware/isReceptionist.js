import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const receptionMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "Receptionist") {
      return res
        .status(403)
        .json({ message: "Forbidden: Access denied for this role" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized " });
  }
};

export default receptionMiddleware;
