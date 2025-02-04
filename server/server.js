import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// App Config
const port = process.env.PORT || 4000;

const app = express();
connectDB();

// Initialize Middlewares
app.use(express.json());
app.use(cors());

// API routes
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => console.log("Server Running on port " + port));
