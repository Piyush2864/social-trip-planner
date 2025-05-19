import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getNearbyTravelers, getUser, loginUser, registerUser, updateProfile } from '../controllers/userController';
import upload from '../middleware/multerMiddleware';


const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/get-user').get(authMiddleware, getUser);

router.route('/update').put(authMiddleware, upload.single("profilePic"), updateProfile);

router.route('/nearby').get(authMiddleware, getNearbyTravelers);

export default router;