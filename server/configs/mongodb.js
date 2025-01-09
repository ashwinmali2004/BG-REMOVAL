import mongoose from "mongoose";

let isConnected = false; // Track the database connection status

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return; // Use existing connection if already established
    }

    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB Connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB Connection Error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Enable connection pooling
        });

        isConnected = true; // Set connection status
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw new Error("Database connection failed");
    }
};

export default connectDB;
