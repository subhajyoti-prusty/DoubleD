import mongoose, { Schema, Document } from "mongoose";

// Define Alert Interface
interface IAlert extends Document {
    message: string;
    location?: string; // Optional geolocation or address
    timestamp: Date;
}

// Define Mongoose Schema
const AlertSchema: Schema = new Schema({
    message: { type: String, required: true },
    location: { type: String, required: false },
    timestamp: { type: Date, default: Date.now }
});

// Create Model
const Alert = mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;
