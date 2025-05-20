import express from 'express';
import authMiddleware, { isAdmin } from '../middleware/authMiddleware';
import { deleteUser, getAllTrips, getAllUsers, getTripsByUserId, searchTrips } from '../controllers/aminController';


const router = express.Router();

router.route('/all-user').get(authMiddleware, isAdmin, getAllUsers);

router.route('/delete-user/:userId').delete(authMiddleware, isAdmin, deleteUser);

router.route('/get-all-trips').get(authMiddleware, isAdmin, getAllTrips);

router.route('/get-trip/:userId').get(authMiddleware, isAdmin, getTripsByUserId);

router.route('/search').post(authMiddleware, isAdmin, searchTrips);

export default router;