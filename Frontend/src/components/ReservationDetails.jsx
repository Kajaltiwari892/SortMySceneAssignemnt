import React, { useState, useEffect } from "react";
import ReservationTimer from "./ReservationTimer";
import "../styles/ReservationDetails.css";

export const ReservationDetails = ({
  userId,
  reservations,
  isLoading,
  onCancelReservation,
  error,
}) => {
  if (!reservations || reservations.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCancelClick = async (reservationId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this reservation? You can't undo this action.",
      )
    ) {
      await onCancelReservation(reservationId);
    }
  };

  return (
    <div className="reservation-details-container">
      <div className="reservation-header">
        <h2>📋 Your Reserved Seats</h2>
        <p className="reservation-count">
          {reservations.length} active reservation
          {reservations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="reservations-list">
        {reservations.map((reservation, index) => (
          <div key={reservation.reservationId} className="reservation-card">
            <div className="card-header">
              <span className="card-number">Reservation #{index + 1}</span>
              <span className="reservation-id">
                ID: {reservation.reservationId?.substring(0, 8) || "N/A"}...
              </span>
            </div>

            {/* Event Information */}
            <div className="event-info-section">
              <h3>🎬 Event Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Event:</span>
                  <span className="value">
                    {reservation.eventName || "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Date:</span>
                  <span className="value">
                    {formatDate(reservation.eventDate)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Time:</span>
                  <span className="value">
                    {reservation.eventTime || "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Venue:</span>
                  <span className="value">
                    {reservation.eventVenue || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Seats Information */}
            <div className="seats-info-section">
              <h3>💺 Reserved Seats</h3>
              <div className="seats-summary">
                <div className="seats-count">
                  <span className="count-number">
                    {reservation.numberOfSeats}
                  </span>
                  <span className="count-label">
                    Seat{reservation.numberOfSeats !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="seats-list">
                  {reservation.seatNumbers.map((seat, idx) => (
                    <span key={idx} className="seat-badge">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reservation Status */}
            <div className="reservation-status-section">
              <h3>⏱️ Reservation Status</h3>
              <div className="status-info">
                <span className="status-label">Status:</span>
                <span className="status-value">
                  {reservation.status || "Active"}
                </span>
              </div>

              {/* Timer */}
              <div className="timer-container">
                <ReservationTimer
                  expiresInSeconds={reservation.expiresInSeconds}
                  onExpire={() => {
                    // Handle expiry
                  }}
                />
                <p className="timer-info">
                  ⏰ Complete your booking before the timer runs out
                </p>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="reservation-meta">
              <div className="meta-item">
                <span className="meta-label">Reservation Created:</span>
                <span className="meta-value">
                  {new Date(reservation.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Expires At:</span>
                <span className="meta-value">
                  {new Date(reservation.expiresAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="cancel-btn"
                onClick={() => handleCancelClick(reservation.reservationId)}
                disabled={isLoading}
              >
                ❌ Cancel Reservation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="info-box">
        <div className="info-content">
          <h4>💡 How it works?</h4>
          <ul>
            <li>Your seats are reserved for 10 minutes</li>
            <li>Complete booking before the timer runs out</li>
            <li>Once confirmed, seats become permanently booked</li>
            <li>You can cancel anytime to release the seats</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
