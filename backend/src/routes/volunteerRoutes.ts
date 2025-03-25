import express from "express";
import { registerVolunteer, getAllVolunteers, assignVolunteer } from "../controllers/volunteerController";

const router = express.Router();

// Route to register a new volunteer
router.post("/", registerVolunteer);

// Route to get all volunteers
router.get("/", getAllVolunteers);

// Route to assign a volunteer to a disaster location
router.put("/:volunteerId", assignVolunteer);

export default router;
