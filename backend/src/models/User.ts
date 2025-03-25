import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "Volunteer" | "NGO" | "Admin";
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Volunteer", "NGO", "Admin"], required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
