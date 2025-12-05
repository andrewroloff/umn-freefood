import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import Event from "./models/Event.js";
import eventsRouter from "./routes/events.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/events", eventsRouter);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// Connect to MongoDB (MONGO_URI in .env)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err.message));

// CRON JOB - dev: run every minute to make testing faster.
// Change to "0 * * * *" for hourly in production.
cron.schedule("* * * * *", async () => {
    const now = new Date();
    const res = await Event.deleteMany({ datetime: { $lt: now } });
    if (res.deletedCount) console.log(`Deleted ${res.deletedCount} expired events`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
