import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
    type: string;
    quantity: number;
    location: string;
    addedBy: string;
}

const ResourceSchema: Schema = new Schema({
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IResource>("Resource", ResourceSchema);
