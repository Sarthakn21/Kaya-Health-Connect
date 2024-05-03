import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//function to register new user
//method : Post
//api-url: http://localhost:5000/api/users/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role)
      throw new ApiError(400, "All feilds are required for registering");

    const existingUser = await User.findOne({
      $and: [{ username }, { role }, { email }],
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const user = new User({ username, email, password, role });
    await user.save();
    // console.log(user);
    const registeredUser = await User.findById(user._id).select("-password");
    if (!registeredUser) throw new ApiError(500, "Unable to register user");
    return res
      .status(201)
      .json(
        new ApiResponse(200, registeredUser, "User registered successfully")
      );
  } catch (error) {
    console.log("in error block", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
    next(error);
  }
};

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Unable to generate Access and refresh token");
  }
};

//function to login user and generate jwt tokens
//method : Post
//api-url: http://localhost:5000/api/users/login
const loginUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role)
      throw new ApiError(400, "All feilds are required");

    const user = await User.findOne({ username });

    // console.log("User Retrieved:", user);
    // Checking if the username exists
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.role !== role)
      throw new ApiError(404, "You are not assigned for this role");

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new ApiError(409, "Incorrect Password");

    const { accessToken } = await generateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -_id");

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, loggedInUser, "User Logged in successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

//function to delete user by its id
//method : Delete
//api-url: http://localhost:5000/api/users/delete/:id
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("this is  id", id);
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    await user.deleteOne();

    res.status(200).json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");

    res.status(200).json(new ApiResponse(200, users, "All user fetched"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user?.refreshToken !== req.cookies?.refreshToken)
      throw new ApiError(400, "Unauthorized request");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, "Tokens updated successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: "Unable to generate access and refreshtoken",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    console.log("in logout", req);
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: "logout unsuccessful",
      error: error.message,
    });
  }
};

const changeCurrentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "Current User fetched successfully")
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
export {
  registerUser,
  loginUser,
  logoutUser,
  deleteById,
  getAllUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};
