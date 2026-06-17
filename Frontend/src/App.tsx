import { useState, useEffect } from "react";
import EventList from "./components/EventList";
import SeatGrid from "./components/SeatGrid";
import ReservationConfirm from "./components/ReservationConfirm";
import BookingConfirm from "./components/BookingConfirm";
import ReservationDetails from "./components/ReservationDetails";
import {
  setUserId,
  reserveSeats,
  confirmBooking,
  cancelReservation,
  getUserReservations,
} from "./utils/api";
import "./App.css";

function App() {
  const [userId, setUserIdState] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserInput, setShowUserInput] = useState(true);
  const [userReservations, setUserReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

  // Initialize user ID from localStorage or generate new one
  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", storedUserId);
    }
    setUserIdState(storedUserId);
    setUserId(storedUserId);
    setShowUserInput(false);
  }, []);

  // Fetch user reservations
  useEffect(() => {
    if (!userId) return;

    const fetchReservations = async () => {
      setReservationsLoading(true);
      try {
        const response = await getUserReservations(userId);
        if (response.success && response.data) {
          setUserReservations(response.data);
        }
      } catch (err) {
        console.log("No active reservations");
      } finally {
        setReservationsLoading(false);
      }
    };

    fetchReservations();

    // Refresh reservations every 5 seconds
    const interval = setInterval(fetchReservations, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    setSelectedSeats([]);
    setError(null);
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleReserveSeats = async () => {
    if (!selectedSeats || selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await reserveSeats(
        userId,
        selectedEventId,
        selectedSeats,
      );

      if (response.success) {
        setReservation({
          reservationId: response.data.reservationId,
          expiresInSeconds: response.data.expiresInSeconds,
        });
        // Refresh user reservations
        const resResponse = await getUserReservations(userId);
        if (resResponse.success && resResponse.data) {
          setUserReservations(resResponse.data);
        }
      } else {
        setError(response.message || "Failed to reserve seats");
      }
    } catch (err) {
      setError(err.message || "Error reserving seats");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!reservation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await confirmBooking(
        reservation.reservationId,
        userId,
        selectedEventId,
        selectedSeats,
      );

      if (response.success) {
        setBookingStatus({
          status: "success",
          message: "Your booking has been confirmed!",
          seatNumbers: selectedSeats,
        });
        setReservation(null);
        setSelectedSeats([]);
        // Refresh user reservations
        const resResponse = await getUserReservations(userId);
        if (resResponse.success && resResponse.data) {
          setUserReservations(resResponse.data);
        }
      } else {
        setError(response.message || "Failed to confirm booking");
      }
    } catch (err) {
      setError(err.message || "Error confirming booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;

    setLoading(true);
    try {
      await cancelReservation(reservation.reservationId, userId);
      setReservation(null);
      setSelectedSeats([]);
      // Refresh user reservations
      const response = await getUserReservations(userId);
      if (response.success && response.data) {
        setUserReservations(response.data);
      }
    } catch (err) {
      setError(err.message || "Error cancelling reservation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservationDetails = async (reservationId) => {
    setLoading(true);
    try {
      await cancelReservation(reservationId, userId);
      // Refresh user reservations
      const response = await getUserReservations(userId);
      if (response.success && response.data) {
        setUserReservations(response.data);
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Error cancelling reservation");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBookingConfirm = () => {
    setBookingStatus(null);
    setSelectedEventId(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 Event Ticket Booking System</h1>
        <p className="subtitle">Reserve and book your event tickets</p>
        {userId && (
          <p className="user-info">
            User ID: <code>{userId.substring(0, 12)}...</code>
          </p>
        )}
      </header>

      <main className="app-main">
        {/* Show User Reservations */}
        {userReservations.length > 0 && (
          <ReservationDetails
            userId={userId}
            reservations={userReservations}
            isLoading={reservationsLoading}
            onCancelReservation={handleCancelReservationDetails}
            error={error}
          />
        )}

        {!selectedEventId ? (
          <EventList
            onSelectEvent={handleSelectEvent}
            selectedEventId={selectedEventId}
          />
        ) : (
          <div className="booking-flow">
            <button
              className="back-btn"
              onClick={() => {
                setSelectedEventId(null);
                setSelectedSeats([]);
                setReservation(null);
              }}
            >
              ← Back to Events
            </button>

            {!reservation ? (
              <SeatGrid
                eventId={selectedEventId}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                onReserve={handleReserveSeats}
              />
            ) : (
              <ReservationConfirm
                reservation={reservation}
                selectedSeats={selectedSeats}
                onConfirmBooking={handleConfirmBooking}
                onCancel={handleCancelReservation}
                isLoading={loading}
                error={error}
              />
            )}
          </div>
        )}

        {bookingStatus && (
          <BookingConfirm
            status={bookingStatus.status}
            message={bookingStatus.message}
            seatNumbers={bookingStatus.seatNumbers}
            onClose={handleCloseBookingConfirm}
          />
        )}

        {error && !bookingStatus && <div className="global-error">{error}</div>}
      </main>

      <footer className="app-footer">
        <p>© 2024 Event Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
