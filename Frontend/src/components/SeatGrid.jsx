import React, { useState, useEffect } from "react";
import { getEventById } from "../utils/api";
import "../styles/SeatGrid.css";

export const SeatGrid = ({
  eventId,
  selectedSeats,
  onSeatSelect,
  onReserve,
}) => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await getEventById(eventId);
        if (response.success) {
          setEventData(response.data);
        } else {
          setError(response.message || "Failed to fetch event details");
        }
      } catch (err) {
        setError(err.message || "Error fetching event details");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const handleSeatClick = (seatNumber) => {
    onSeatSelect(seatNumber);
  };

  if (loading) return <div className="loading">Loading seats...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!eventData) return <div>No event data</div>;

  const { event, seats, availableSeats, bookedSeats, reservedSeats } =
    eventData;

  return (
    <div className="seat-grid-container">
      <div className="seat-info">
        <h3>{event.name}</h3>
        <p>
          Available: {availableSeats} | Reserved: {reservedSeats} | Booked:{" "}
          {bookedSeats}
        </p>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat reserved"></div>
          <span>Reserved</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="seats-display">
        {Object.entries(seats).map(([row, rowSeats]) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats">
              {rowSeats.map((seat) => (
                <button
                  key={seat.seatNumber}
                  className={`seat ${seat.status} ${
                    selectedSeats.includes(seat.seatNumber) ? "selected" : ""
                  }`}
                  onClick={() => handleSeatClick(seat.seatNumber)}
                  disabled={seat.status !== "available"}
                  title={`Seat ${seat.seatNumber} - ${seat.status}`}
                >
                  {seat.column}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-selection-info">
        <p>
          Selected Seats:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </p>
        <button
          className="reserve-btn"
          onClick={onReserve}
          disabled={selectedSeats.length === 0}
        >
          Reserve Selected Seats
        </button>
      </div>
    </div>
  );
};

export default SeatGrid;
