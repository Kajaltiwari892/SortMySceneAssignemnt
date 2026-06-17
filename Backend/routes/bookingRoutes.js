import express from "express";
import {
  reserveSeats,
  confirmBooking,
  getReservation,
  cancelReservation,
  getUserReservations,
} from "../controllers/bookingController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Reserve seats
router.post("/reserve", optionalAuth, reserveSeats);

// Confirm booking
router.post("/bookings", optionalAuth, confirmBooking);

// Get user's reservations
router.get("/user/:userId/reservations", getUserReservations);

// Get reservation details
router.get("/reservations/:reservationId", getReservation);

// Cancel reservation
router.delete("/reservations/:reservationId", optionalAuth, cancelReservation);

export default router;
