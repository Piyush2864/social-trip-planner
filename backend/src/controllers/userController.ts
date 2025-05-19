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
      password
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password,
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

export const updateProfile = async (
  req: Request & { user?: { userId: string } },
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const {
      name,
      password,
      number,
      interests,
      profilePic,
      coordinates,
      country,
      city,
    } = req.body;

    if(name) user.name = name;
    if(password) user.password = password;
    if (number) user.number = number;
    if (interests) user.interests = interests;
    if (profilePic) user.profilePic = profilePic;

    if (coordinates || country || city) {
      const currentLocation = Array.isArray(user.location) ? user.location[0] : user.location;
      user.location = {
        type: "Point",
        coordinates: coordinates || currentLocation?.coordinates,
        country: country || currentLocation?.country,
        city: city || currentLocation?.city,
      } as any; 
    }

    if(req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        interests: user.interests,
        profilePic: user.profilePic,
        location: user.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getNearbyTravelers = async(req: Request & { user?: { userId: string } }, res: Response) : Promise<void>=> {
  try {
    const currentUser = await User.findById(req.user?.userId);
    let userLocation = Array.isArray(currentUser?.location) ? currentUser.location[0] : currentUser?.location;

    if(
      !currentUser ||
      !userLocation ||
      !userLocation.coordinates
    ) {
      res.status(400).json({
        success: false,
        message: "User location not found"
      });
      return;
    }

    const [lng, lat] = userLocation.coordinates;

    const radiusInKm = Number(req.query.radius) || 10;
    const radiusInMeters = radiusInKm * 1000;

    const nearbyUsers = await User.find({
      _id: { $ne: currentUser._id},
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInMeters
        }
      }
    }).select("-password");

    res.status(200).json({
      success: true,
      message: `User within ${radiusInKm}km`,
      nearbyUsers
    });
  } catch (error) {
     res.status(500).json({
      success: false,
      message: "Server error",
      error: error
    });
  }
}

export const getInterestBaseUser = async(req: Request, res: Response): Promise<void>=> {
  try {
    const currentUser = await User.findById(req.user?.userId);
    if(!currentUser || !currentUser.location || !Array.isArray(currentUser.location) || !currentUser.location[0] || !currentUser.location[0].coordinates || !Array.isArray(currentUser.interests)){
      res.status(400).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    const [lng, lat] = currentUser.location[0].coordinates;
    const radiusInKm = Number(req.query.radius) || 10;
    const radiusInMeters = radiusInKm * 1000;

    const matches = await User.find({
      _id: { $ne: currentUser._id},
      interests: { $in: currentUser.interests},
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radiusInMeters,
        }
      }
    }).select("-password");

    res.status(200).json({
      success: true,
      message: `Found ${matches.length} nearby users with shared interests`,
      matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
}