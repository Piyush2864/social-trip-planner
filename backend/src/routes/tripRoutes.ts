import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { createTrip, deleteTrip, getAllTrips, getTripById, updateTrip } from '../controllers/tripController';


const router = express.Router();

router.route('/create-trip').post(authMiddleware, createTrip);

router.route('/get-all-trip').get(authMiddleware, getAllTrips);

router.route('/get-trip/:id').get(authMiddleware, getTripById);

router.route('/update-trip:id').put(authMiddleware, updateTrip);

router.route('/delete-trip/:id').delete(authMiddleware, deleteTrip);

export default router;