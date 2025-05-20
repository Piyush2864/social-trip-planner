import Trip from "../models/tripModel";
import User from "../models/userModel";
import { Request, Response } from "express";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      res.status(404).json({
        message: "Users not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    const trips = await Trip.find().populate("creator", "name email");

    if (!trips) {
       res.status(404).json({
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

export const getTripsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const trips = await Trip.find({ creator: userId });

    if (!trips) {
       res.status(404).json({
        message: "Trips not found",
      });
    }

     res.status(200).json({
      message: "Trips by user fetched successfully",
      trips,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

export const searchTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      keyword,
      userId,
      city,
      country,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter: any = {};

    if (keyword) {
      filter.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    if (userId) {
      filter.creator = userId;
    }

    if (city || country) {
      filter["location.city"] = city;
      filter["location.country"] = country;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const trips = await Trip.find(filter)
      .sort({ [sortBy as string]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .populate("creator", "name email");

    const total = await Trip.countDocuments(filter);

    if (!trips) {
       res.status(404).json({
        message: "Trips not found",
      });
    }

    res.status(200).json({
      message: "Trips fetched successfully",
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      trips,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
};
