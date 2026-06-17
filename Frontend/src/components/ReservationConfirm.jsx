import React from "react";
import ReservationTimer from "./ReservationTimer";
import "../styles/ReservationConfirm.css";

export const ReservationConfirm = ({
  reservation,
  selectedSeats,
  onConfirmBooking,
  onCancel,
  isLoading,
  error,
}) => {
  if (!reservation) return null;

  const { expiresInSeconds } = reservation;

  return (
    <div className="reservation-confirm-overlay">
      <div className="reservation-confirm-modal">
        <h2>Confirm Your Booking</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="reservation-details">
          <h3>Reservation Details</h3>
          <p>
            <strong>Reservation ID:</strong>{" "}
            {reservation.reservationId?.substring(0, 8) || "Loading..."}...
          </p>
          <p>
            <strong>Selected Seats:</strong> {selectedSeats.join(", ")}
          </p>
          <p>
            <strong>Number of Seats:</strong> {selectedSeats.length}
          </p>
        </div>

        <ReservationTimer
          expiresInSeconds={expiresInSeconds}
          onExpire={onCancel}
        />

        <div className="button-group">
          <button
            className="confirm-btn"
            onClick={onConfirmBooking}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </button>
          <button
            className="cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel Reservation
          </button>
        </div>

        <p className="info-text">
          ⏰ Complete your booking before the timer runs out
        </p>
      </div>
    </div>
  );
};

export default ReservationConfirm;
