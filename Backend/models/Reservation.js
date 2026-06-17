import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },
  seatNumbers: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["active", "expired", "confirmed"],
    default: "active",
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // TTL index
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Reservation", reservationSchema);
