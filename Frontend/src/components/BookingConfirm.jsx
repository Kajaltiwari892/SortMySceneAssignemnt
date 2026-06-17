import React from "react";
import "../styles/BookingConfirm.css";

export const BookingConfirm = ({ status, message, seatNumbers, onClose }) => {
  if (!status) return null;

  const isSuccess = status === "success";

  return (
    <div className="booking-confirm-overlay">
      <div
        className={`booking-confirm-modal ${isSuccess ? "success" : "error"}`}
      >
        <div className="status-icon">{isSuccess ? "✓" : "✗"}</div>

        <h2>{isSuccess ? "Booking Confirmed!" : "Booking Failed"}</h2>

        <p className="status-message">{message}</p>

        {isSuccess && seatNumbers && (
          <div className="booking-details">
            <p>
              <strong>Booked Seats:</strong> {seatNumbers.join(", ")}
            </p>
            <p className="confirmation-text">
              Your seats have been successfully booked. You will receive a
              confirmation email shortly.
            </p>
          </div>
        )}

        {!isSuccess && (
          <p className="error-advice">
            Please try again or select different seats.
          </p>
        )}

        <button className="close-btn" onClick={onClose}>
          {isSuccess ? "Continue" : "Try Again"}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirm;
