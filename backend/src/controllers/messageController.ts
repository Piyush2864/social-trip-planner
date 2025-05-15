import { Request, Response } from "express";
import Message from "../models/messageModel";

interface MessageRequest extends Request {
  params: {
    tripId: string;
  };
  user?: {
    userId: string;
  };
  body: {
    content: string;
  };
}

export const sendMessage = async (
  req: MessageRequest,
  res: Response
): Promise<void> => {
  try {
    const { content } = req.body;
    const { tripId } = req.params;
    const userId = req.user?.userId;

    if (!content || !userId) {
      res.status(400).json({
        success: false,
        message: "Content and userId are required",
      });
      return;
    }

    const message = await Message.create({
      tripId,
      userId,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
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

export const getMessage = async (
  req: MessageRequest,
  res: Response
): Promise<void> => {
  try {
    const { tripId } = req.params;
    if (!tripId) {
      res.status(400).json({
        success: false,
        message: "Trip ID is required",
      });
    }

    const message = await Message.find({ tripId })
      .populate("userId", "name email profilePic")
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
        message: "You can delete your own messages",
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
