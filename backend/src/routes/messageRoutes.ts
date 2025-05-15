import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { deleteMessage, getMessage, sendMessage } from '../controllers/messageController';


const router = express.Router();

router.route('/send-message/:tripId').post(authMiddleware, sendMessage);

router.route('/get-message/:tripid').get(authMiddleware, getMessage);

router.route('/delete-message/:id').delete(authMiddleware, deleteMessage);

export default router;