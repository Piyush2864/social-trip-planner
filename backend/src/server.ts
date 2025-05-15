import express from 'express';
import dotenv from 'dotenv';
import { connectToDb } from './db/config';
import userRoutes from './routes/userRoutes';
import tripRoutes from './routes/tripRoutes';


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.use('/api/user', userRoutes);
app.use('/api/trip', tripRoutes);

const PORT = process.env.PORT;

app.get('/', (req, res)=> {
    res.send('Hello Tourists');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});