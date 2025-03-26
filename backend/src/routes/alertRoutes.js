const express = require("express");
const { createAlert, getAlerts, deleteAlert } = require("../controllers/alertController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createAlert);
router.get("/", getAlerts);
router.delete("/:id", authenticateUser, deleteAlert);

module.exports = router;
