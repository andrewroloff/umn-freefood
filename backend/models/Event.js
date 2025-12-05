import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    datetime: { type: Date, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", EventSchema);
