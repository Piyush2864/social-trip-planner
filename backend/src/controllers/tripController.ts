import { Request, Response } from 'express';
import Trip from '../models/tripModel';


export const createTrip = async (req: Request, res: Response) => {
  try {
    const { title, destination, startDate, endDate, description, members, tags } = req.body;

    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      description,
      creator: req.user?.userId, 
      members,
      tags
    });

    res.status(201).json({ message: 'Trip created', trip });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


export const getAllTrips = async (_req: Request, res: Response) => {
  try {
    const trips = await Trip.find().populate('creator', 'name email').populate('members', 'name email');
    res.status(200).json({ trips });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


export const getTripById = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('creator', 'name email').populate('members', 'name email');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json({ trip });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


export const updateTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json({ message: 'Trip updated', trip });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
