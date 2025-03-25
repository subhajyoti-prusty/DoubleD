import { Request, Response } from "express";
import Volunteer from "../models/Volunteer";
import User from "../models/User";

// Register a new volunteer
export const registerVolunteer = async (req: Request, res: Response) => {
    try {
        const { userId, assignedDisasterLocation } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const volunteer = new Volunteer({ userId, assignedDisasterLocation });
        await volunteer.save();

        res.status(201).json({ success: true, data: volunteer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error registering volunteer" });
    }
};

// Get all volunteers
export const getAllVolunteers = async (req: Request, res: Response) => {
    try {
        const volunteers = await Volunteer.find().populate("userId", "name email");
        res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching volunteers" });
    }
};

// Assign a volunteer to a disaster location
export const assignVolunteer = async (req: Request, res: Response) => {
    try {
        const { volunteerId } = req.params;
        const { assignedDisasterLocation } = req.body;

        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: "Volunteer not found" });
        }

        volunteer.assignedDisasterLocation = assignedDisasterLocation;
        await volunteer.save();

        res.status(200).json({ success: true, data: volunteer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error assigning volunteer" });
    }
};
