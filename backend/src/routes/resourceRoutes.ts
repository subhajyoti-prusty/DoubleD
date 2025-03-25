import express from "express";
import { addResource, getResources } from "../controllers/resourceController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, addResource);
router.get("/", getResources);

export default router;
