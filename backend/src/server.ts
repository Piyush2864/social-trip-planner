import express from 'express';
import dotenv from 'dotenv';
import { connectToDb } from './db/config';
import userRoutes from './routes/userRoutes';
import tripRoutes from './routes/tripRoutes';
import messageRoute from './routes/messageRoutes';
import http from 'http';
import { intializeSocket } from './utils/socket';
import path from 'path';


dotenv.config();

const app = express();
const server = http.createServer(app);

intializeSocket(server);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.use('/api/user', userRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/message', messageRoute);

const PORT = process.env.PORT;

app.get('/', (req, res)=> {
    res.send('Hello Tourists');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
