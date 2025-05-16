import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getNearbyTravelers, getUser, loginUser, registerUser } from '../controllers/userController';


const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/get-user').get(authMiddleware, getUser);

router.route('/nearby').get(authMiddleware, getNearbyTravelers);

export default router;