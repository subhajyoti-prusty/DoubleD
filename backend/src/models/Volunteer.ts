import mongoose, { Schema, Document } from "mongoose";

// Define Volunteer Interface
interface IVolunteer extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    assignedDisasterLocation?: string; // Optional assignment
}

// Define Mongoose Schema
const VolunteerSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedDisasterLocation: { type: String, required: false }
});

// Create Model
const Volunteer = mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);

export default Volunteer;
