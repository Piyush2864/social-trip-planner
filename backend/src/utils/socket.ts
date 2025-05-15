import {Server as HTTPServer} from 'http';
import { Server as SocketIOServer} from 'socket.io';

let io: SocketIOServer;

export const intializeSocket = (server: HTTPServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinTrip', (tripId: string) => {
            socket.join(tripId);
            console.log(`Socket ${socket.id} joined trip ${tripId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export const getIO = () => {
    if(!io) {
        throw new Error('Socket.io not initialized');
    }

    return io;
};