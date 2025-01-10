import mongoose from "mongoose";

let isConnected = false; // Global variable to track connection status

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return mongoose.connection; // Return the existing connection
    }

    if (mongoose.connection.readyState > 0) {
        // If mongoose connection is already established
        console.log("Reusing existing connection");
        isConnected = true;
        return mongoose.connection;
    }

    try {
        // Use event listeners to log connection status
        mongoose.connection.on("connected", () => {
            console.log("MongoDB Connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB Connection Error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected");
        });

        // Establish a new connection
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain a pool of database connections
        });

        isConnected = true; // Set the connection status to true
        console.log("New MongoDB connection established");

        return connection;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw new Error("Database connection failed");
    }
};

export default connectDB;
