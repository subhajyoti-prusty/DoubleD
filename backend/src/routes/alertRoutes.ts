import express from "express";
import { createAlert, getAllAlerts } from "../controllers/alertController";

const router = express.Router();

// Route to create a new alert
router.post("/", createAlert);

// Route to get all alerts
router.get("/", getAllAlerts);

export default router;
