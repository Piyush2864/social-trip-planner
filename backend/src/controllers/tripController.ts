import { Request, Response } from "express";
import Trip from "../models/tripModel";

export const createTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      members,
      tags,
    } = req.body;

    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      description,
      creator: req.user?.userId,
      members,
      tags,
    });

    res.status(201).json({ message: "Trip created", trip });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getAllTrips = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const trips = await Trip.find()
      .populate("creator", "name email")
      .populate("members", "name email");
    res.status(200).json({ trips });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getTripById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("creator", "name email")
      .populate("members", "name email");

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.status(200).json({ trip });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.status(200).json({ message: "Trip updated", trip });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.status(200).json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const joinTrip = async (
  req: Request & { user?: { userId: string } },
  res: Response
): Promise<void> => {
  try {
    const tripId = req.params.id;
    const userId = req.user?.userId;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    if (
      Array.isArray(trip.members) &&
      trip.members.map((m) => m.toString()).includes(userId!)
    ) {
      res.status(400).json({ message: "User already a member of this trip" });
      return;
    }

    if (!Array.isArray(trip.members)) {
      trip.members = [];
    }
    trip.members.push(userId!);
    await trip.save();

    res.status(200).json({ message: "Joined the trip successfully", trip });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const leaveTrip = async (
  req: Request & { user?: { userId: string } },
  res: Response
): Promise<void> => {
  try {
    const tripId = req.params.id;
    const userId = req.user?.userId;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    if (
      !Array.isArray(trip.members) ||
      !trip.members.map((m) => m.toString()).includes(userId!)
    ) {
      res.status(400).json({ message: "User is not a member of this trip" });
      return;
    }

    trip.members = trip.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    await trip.save();

    res.status(200).json({ message: "Left the trip successfully", trip });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const sendJoinRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tripId } = req.params;
    const userId = req.user?.userId;

    const trip = await Trip.findById(tripId);

    if (!tripId) {
      res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip?.creator?.toString() === userId) {
      res.status(400).json({
        message: "You are the trip creator.",
      });
    }

    if (
      Array.isArray(trip?.participants) &&
      trip.participants.map((p: any) => p.toString()).includes(userId)
    ) {
      res.status(400).json({
        message: "You are already a participant",
      });
    }

    if (
      Array.isArray(trip?.joinRequests) &&
      trip.joinRequests.map((j: any) => j.toString().includes(userId))
    ) {
      res.status(400).json({
        message: "Join request already sent",
      });
    }

    if (trip) {
      if (!Array.isArray(trip.joinRequests)) {
        trip.joinRequests = [];
      }
      trip.joinRequests.push(userId!);

      await trip.save();
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
