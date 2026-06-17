import React, { useState, useEffect } from "react";
import { getEvents } from "../utils/api";
import "../styles/EventList.css";

export const EventList = ({ onSelectEvent, selectedEventId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents();
        if (response.success) {
          setEvents(response.data);
        } else {
          setError(response.message || "Failed to fetch events");
        }
      } catch (err) {
        setError(err.message || "Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="event-list">
      <h2>Available Events</h2>
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event._id}
              className={`event-card ${selectedEventId === event._id ? "selected" : ""}`}
              onClick={() => onSelectEvent(event._id)}
            >
              <h3>{event.name}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Venue:</strong> {event.venue}
              </p>
              <p>
                <strong>Total Seats:</strong> {event.totalSeats}
              </p>
              <button className="select-btn">
                {selectedEventId === event._id ? "Selected" : "Select Event"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
