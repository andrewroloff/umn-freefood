import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get future events only
router.get("/", async (req, res) => {
    const now = new Date();
    const events = await Event.find({ datetime: { $gte: now } }).sort("datetime");
    res.json(events);
});

// Delete manually
router.delete("/:id", async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
