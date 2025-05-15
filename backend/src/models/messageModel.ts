import mongoose, { Schema } from 'mongoose';
import { Message } from '../types/messageTypes';


const messageSchema = new Schema<Message>({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    content: {
        type: String
    },
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);

export default Message;