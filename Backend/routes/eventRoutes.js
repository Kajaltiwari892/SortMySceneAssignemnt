import express from "express";
import {
  getAllEvents,
  getEventById,
  initializeSeats,
} from "../controllers/eventController.js";

const router = express.Router();

// Get all events
router.get("/", getAllEvents);

// Get event by ID with seats
router.get("/:id", getEventById);

// Initialize seats for an event
router.post("/initialize/seats", initializeSeats);

export default router;
