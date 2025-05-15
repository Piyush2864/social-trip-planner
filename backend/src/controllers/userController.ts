import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { IUser } from "../types/userType";
import { HydratedDocument } from "mongoose";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      number,
      interests,
      profilePic,
      coordinates,
      country,
      city,
    } = req.body;

    const location = {
      type: "Point",
      coordinates, 
      country,
      city,
    };

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password,
      location,
      number,
      interests,
      profilePic,
    });

    res.status(201).json({
      message: "User registered",
      newUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({
      email,
    })) as HydratedDocument<IUser> | null;
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken((user._id as string).toString());

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        number: user.number,
        interests: user.interests,
        profilePic: user.profilePic,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getUser = async (
  req: Request & { user?: { userId: string } },
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
