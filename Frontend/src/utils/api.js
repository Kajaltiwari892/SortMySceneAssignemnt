import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add userId to headers if available
export const setUserId = (userId) => {
  apiClient.defaults.headers.common["x-user-id"] = userId;
};

// Remove userId from headers
export const clearUserId = () => {
  delete apiClient.defaults.headers.common["x-user-id"];
};

// Events API
export const getEvents = async () => {
  const response = await apiClient.get("/events");
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await apiClient.get(`/events/${eventId}`);
  return response.data;
};

export const initializeSeats = async (eventId) => {
  const response = await apiClient.post("/events/initialize/seats", {
    eventId,
  });
  return response.data;
};

// Booking API
export const reserveSeats = async (userId, eventId, seatNumbers) => {
  const response = await apiClient.post("/reserve", {
    userId,
    eventId,
    seatNumbers,
  });
  return response.data;
};

export const confirmBooking = async (
  reservationId,
  userId,
  eventId,
  seatNumbers,
) => {
  const response = await apiClient.post("/bookings", {
    reservationId,
    userId,
    eventId,
    seatNumbers,
  });
  return response.data;
};

export const getReservation = async (reservationId) => {
  const response = await apiClient.get(`/reservations/${reservationId}`);
  return response.data;
};

export const getUserReservations = async (userId) => {
  const response = await apiClient.get(`/user/${userId}/reservations`);
  return response.data;
};

export const cancelReservation = async (reservationId, userId) => {
  const response = await apiClient.delete(`/reservations/${reservationId}`, {
    data: { userId },
  });
  return response.data;
};

export default apiClient;
