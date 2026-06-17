import Event from '../models/Event.js';
import Seat from '../models/Seat.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single event by ID with seat status
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Get seats for this event
    const seats = await Seat.find({ eventId: id }).sort({ row: 1, column: 1 });

    // Group seats by row for easier UI rendering
    const seatsByRow = {};
    seats.forEach((seat) => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    });

    res.status(200).json({
      success: true,
      data: {
        event,
        seats: seatsByRow,
        totalSeats: seats.length,
        availableSeats: seats.filter((s) => s.status === 'available').length,
        bookedSeats: seats.filter((s) => s.status === 'booked').length,
        reservedSeats: seats.filter((s) => s.status === 'reserved').length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Initialize seats for an event (Admin only)
export const initializeSeats = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Clear existing seats
    await Seat.deleteMany({ eventId });

    const seats = [];
    const seatsPerRow = event.seatsPerRow;
    const totalRows = Math.ceil(event.totalSeats / seatsPerRow);

    for (let row = 0; row < totalRows; row++) {
      const rowLabel = String.fromCharCode(65 + row); // A, B, C, etc.
      for (let col = 1; col <= seatsPerRow; col++) {
        if (seats.length < event.totalSeats) {
          seats.push({
            eventId,
            seatNumber: `${rowLabel}${col}`,
            status: 'available',
            row: rowLabel,
            column: col,
          });
        }
      }
    }

    await Seat.insertMany(seats);

    res.status(201).json({
      success: true,
      message: `${seats.length} seats initialized`,
      data: seats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
