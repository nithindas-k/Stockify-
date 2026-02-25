import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { APP_MESSAGES, ROUTES } from './constants/constants';
import authRoutes from './routes/AuthRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockify';
mongoose.connect(mongoURI)
    .then(() => console.log(APP_MESSAGES.DB_CONNECTED))
    .catch((err) => console.error(APP_MESSAGES.DB_CONNECTION_ERROR, err));

app.use(ROUTES.AUTH.ROOT, authRoutes);

app.get('/', (req, res) => {
    res.send('Stockify API is running');
});


app.listen(PORT, () => {
    console.log(`${APP_MESSAGES.SERVER_STARTED} ${PORT}`);
});
