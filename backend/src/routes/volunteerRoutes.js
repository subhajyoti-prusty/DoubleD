const express = require("express");
const { 
    registerVolunteer, 
    getVolunteers, 
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer,
    updateAvailability
} = require("../controllers/volunteerController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.get("/", getVolunteers);
router.post("/", authenticateUser, registerVolunteer);
router.get("/:id", authenticateUser, getVolunteerById);
router.put("/:id", authenticateUser, updateVolunteer);
router.delete("/:id", authenticateUser, deleteVolunteer);
router.patch("/:id/availability", authenticateUser, updateAvailability);

module.exports = router;
