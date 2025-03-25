import { Request, Response } from "express";
import Alert from "../models/Alert";
import { io } from "../index"; // Importing Socket.io instance

// Create a new alert and broadcast it
export const createAlert = async (req: Request, res: Response) => {
  try {
    const { message, location } = req.body;

    const newAlert = new Alert({ message, location });
    await newAlert.save();

    // Emit the alert to all connected clients
    io.emit("receiveAlert", newAlert);

    res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating alert" });
  }
};

// Get all alerts
export const getAllAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching alerts" });
  }
};
