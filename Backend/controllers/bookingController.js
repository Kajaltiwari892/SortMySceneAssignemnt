import mongoose from "mongoose";
import Seat from "../models/Seat.js";
import Reservation from "../models/Reservation.js";

const RESERVATION_EXPIRY_MINUTES = parseInt(
  process.env.RESERVATION_EXPIRY_MINUTES || "10",
);

// Reserve seats
export const reserveSeats = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, eventId, seatNumbers } = req.body;

    // Validate input
    if (!userId || !eventId || !seatNumbers || seatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, eventId, seatNumbers",
      });
    }

    // Check if seats are available (using atomic operations)
    const seats = await Seat.find({
      eventId,
      seatNumber: { $in: seatNumbers },
    }).session(session);

    if (seats.length !== seatNumbers.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "One or more seats not found",
      });
    }

    // Check if all seats are available
    const unavailableSeats = seats.filter(
      (seat) => seat.status !== "available",
    );
    if (unavailableSeats.length > 0) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "One or more seats are not available",
        unavailableSeats: unavailableSeats.map((s) => s.seatNumber),
      });
    }

    // Clear expired reservations for these seats
    await Reservation.deleteMany({
      eventId,
      seatNumbers: { $in: seatNumbers },
      expiresAt: { $lt: new Date() },
    }).session(session);

    // Update seats to reserved
    await Seat.updateMany(
      {
        eventId,
        seatNumber: { $in: seatNumbers },
      },
      { status: "reserved" },
      { session },
    );

    // Create reservation
    const expiresAt = new Date(Date.now() + RESERVATION_EXPIRY_MINUTES * 60000);
    const reservation = new Reservation({
      userId,
      eventId,
      seatNumbers,
      expiresAt,
    });

    await reservation.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Seats reserved successfully",
      data: {
        reservationId: reservation._id,
        seatNumbers,
        expiresAt,
        expiresInSeconds: RESERVATION_EXPIRY_MINUTES * 60,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// Confirm booking
export const confirmBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { reservationId, userId, eventId, seatNumbers } = req.body;

    // Validate input
    if (!reservationId || !userId || !eventId || !seatNumbers) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: reservationId, userId, eventId, seatNumbers",
      });
    }

    // Find reservation
    const reservation =
      await Reservation.findById(reservationId).session(session);

    if (!reservation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Check if reservation is expired
    if (reservation.expiresAt < new Date()) {
      await session.abortTransaction();
      return res.status(410).json({
        success: false,
        message: "Reservation has expired",
      });
    }

    // Verify ownership
    if (reservation.userId !== userId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Unauthorized: This reservation does not belong to you",
      });
    }

    // Verify seats match
    const sortedReservationSeats = reservation.seatNumbers.sort();
    const sortedRequestSeats = seatNumbers.sort();

    if (
      JSON.stringify(sortedReservationSeats) !==
      JSON.stringify(sortedRequestSeats)
    ) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Seat numbers do not match reservation",
      });
    }

    // Check if seats are still reserved
    const seats = await Seat.find({
      eventId,
      seatNumber: { $in: seatNumbers },
    }).session(session);

    const notReservedSeats = seats.filter((seat) => seat.status !== "reserved");
    if (notReservedSeats.length > 0) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "One or more seats are no longer reserved",
        unavailableSeats: notReservedSeats.map((s) => s.seatNumber),
      });
    }

    // Update seats to booked using atomic operation
    const updateResult = await Seat.updateMany(
      {
        eventId,
        seatNumber: { $in: seatNumbers },
        status: "reserved", // Only update if still reserved
      },
      { status: "booked" },
      { session },
    );

    if (updateResult.modifiedCount !== seatNumbers.length) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "One or more seats were modified by another user",
      });
    }

    // Update reservation status
    reservation.status = "confirmed";
    await reservation.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: {
        reservationId: reservation._id,
        seatNumbers,
        status: "confirmed",
      },
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// Get reservation details
export const getReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    const isExpired = reservation.expiresAt < new Date();

    res.status(200).json({
      success: true,
      data: {
        ...reservation.toObject(),
        isExpired,
        expiresInSeconds: Math.max(
          0,
          Math.floor((reservation.expiresAt - new Date()) / 1000),
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's active reservations with event details
export const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch active (non-expired, non-confirmed) reservations for the user
    const reservations = await Reservation.find({
      userId,
      status: { $in: ["active"] },
      expiresAt: { $gt: new Date() },
    }).populate("eventId", "name date time venue totalSeats seatsPerRow");

    const formattedReservations = reservations.map((res) => ({
      reservationId: res._id,
      eventName: res.eventId?.name || "Unknown Event",
      eventDate: res.eventId?.date || null,
      eventTime: res.eventId?.time || null,
      eventVenue: res.eventId?.venue || null,
      seatNumbers: res.seatNumbers,
      numberOfSeats: res.seatNumbers.length,
      status: res.status,
      expiresAt: res.expiresAt,
      expiresInSeconds: Math.max(
        0,
        Math.floor((res.expiresAt - new Date()) / 1000),
      ),
      createdAt: res.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedReservations,
      count: formattedReservations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel reservation
export const cancelReservation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { reservationId } = req.params;
    const { userId } = req.body;

    const reservation =
      await Reservation.findById(reservationId).session(session);

    if (!reservation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Verify ownership
    if (reservation.userId !== userId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Release reserved seats back to available
    await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: { $in: reservation.seatNumbers },
        status: "reserved",
      },
      { status: "available" },
      { session },
    );

    // Update reservation status
    reservation.status = "expired";
    await reservation.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Reservation cancelled",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};
