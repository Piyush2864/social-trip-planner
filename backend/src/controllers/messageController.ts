import { Request, Response } from "express";
import Message from "../models/messageModel";
import { getIO } from "../utils/socket";
import Trip from "../models/tripModel";

interface MessageRequest extends Request {
  params: {
    tripId: string;
  };
  user?: {
    userId: string;
  };
  body: {
    message: string;
  };
}

export const sendMessage = async (
  req: MessageRequest,
  res: Response
): Promise<void> => {
  try {
    const {message} = req.body;
    const { tripId } = req.params;
    const userId = req.user?.userId;

    if (!message || message.trim() || !userId) {
      res.status(400).json({
        success: false,
        message: "Content and userId are required",
      });
      return;
    }

    const trip = await Trip.findById(tripId);
    if(!trip) {
      res.status(404).json({
        message:"Trip not found"
      });
    }

    const isParticipant = Array.isArray(trip?.members) && trip.members.some(memberId => memberId.toString() === userId);
    if(!isParticipant) {
      res.status(403).json({
        message: "You are not a member of this group"
      });
      return;
    }

    const chatMessage = await Message.create({
      tripId,
      userId,
      message,
    });

    const io = getIO();
    io.to(tripId).emit('recievemessage', {
      tripId,
      userId,
      message
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: chatMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

export const getMessage = async (
  req: MessageRequest,
  res: Response
): Promise<void> => {
  try {
    const { tripId } = req.params;
    const userId = req.user?.userId;

    if (!tripId) {
      res.status(400).json({
        success: false,
        message: "Trip ID is required",
      });
    }

    const trip = await Trip.findById(tripId);
    if(!trip) {
      res.status(404).json({
        message: "Trip not found"
      });
    }

    const isParticipant = Array.isArray(trip?.members) && trip.members.some(memberId => memberId.toString() === userId);

    if(!isParticipant) {
      res.status(403).json({
        message: "You are not a member of this trip"
      });
    }

    const message = await Message.find({ tripId })
      .populate("userId", "name profilePic")
      .sort({ createdAt: 1 });

    if (!message) {
      res.status(400).json({
        success: false,
        message: "No message found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

export const deleteMessage = async (
  req: MessageRequest,
  res: Response
): Promise<void> => {
  try {
    const messageId = req.params;
    const userId = req.user?.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(400).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message?.userId.toString() !== userId) {
      res.status(400).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    await message?.deleteOne();
    res.status(200).json({
      success: true,
      message: "Message deleted sucessfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
