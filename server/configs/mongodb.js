import mongoose from "mongoose";

const connectDB = async () => {

        mongoose.connection.on("connected", () => {
            console.log("MongoDB Connected");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`);
}

export default connectDB;
