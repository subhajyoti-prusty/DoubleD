const express = require("express");
const { addResource, getResources, updateResource, deleteResource } = require("../controllers/resourceController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, addResource);
router.get("/", getResources);
router.put("/:id", authenticateUser, updateResource);
router.delete("/:id", authenticateUser, deleteResource);

module.exports = router;
