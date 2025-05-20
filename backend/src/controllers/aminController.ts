import Trip from "../models/tripModel";
import User from "../models/userModel";
import { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      return res.status(404).json({
        message: "Users not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const trips = await Trip.find().populate("creator", "name email");

    if (!trips) {
      return res.status(404).json({
        message: "Trips not found",
      });
    }

    res.status(200).json({
      message: "Trips fetched successfully",
      trips,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
};

export const getTripsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const trips = await Trip.find({ creator: userId });

    if (!trips) {
      return res.status(404).json({
        message: "Trips not found",
      });
    }

    return res.status(200).json({
      message: "Trips by user fetched successfully",
      trips,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error });
  }
};
