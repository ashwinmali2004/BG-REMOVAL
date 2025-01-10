import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
// import userRouter from './routes/userRoutes.js';

// App Config
const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.get('/', (req, res) => res.send('API is Working'));
// app.use('/api/user', userRouter);

// Connect to Database and Start Server
const startServer = async () => {
    try {
        await connectDB(); // Ensure MongoDB is connected before starting the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1); // Exit the process with a failure code
    }
};

startServer();
