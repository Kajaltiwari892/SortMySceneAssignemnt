# Event Ticket Booking System - Full Stack Assignment

## 📋 Overview

This is a complete **Full Stack Event Ticket Booking System** built with the MERN stack (MongoDB, Express, React, Node.js) for a Full-Time Full Stack Developer hiring assignment.

The application demonstrates a simplified event ticket booking flow with focus on:

- Seat reservation with expiration
- Booking confirmation
- Double-booking prevention using atomic operations
- Responsive user interface
- Real-time seat status updates

---

## 🏗️ Project Architecture

### Backend (Node.js + Express + MongoDB)

```
Backend/
├── models/
│   ├── Event.js         # Event schema
│   ├── Seat.js          # Seat schema with status tracking
│   └── Reservation.js   # Reservation schema with expiry
├── controllers/
│   ├── eventController.js    # Event management
│   └── bookingController.js  # Reservation & booking logic
├── routes/
│   ├── eventRoutes.js   # Event endpoints
│   └── bookingRoutes.js # Booking endpoints
├── middleware/
│   ├── auth.js          # User authentication (x-user-id header)
│   └── errorHandler.js  # Error handling
├── .env                 # Environment variables
├── db.js               # MongoDB connection
├── server.js           # Express server setup
└── package.json        # Dependencies
```

### Frontend (React + TypeScript + Vite)

```
Frontend/
├── src/
│   ├── components/
│   │   ├── EventList.jsx           # Display available events
│   │   ├── SeatGrid.jsx            # Seat selection with color coding
│   │   ├── ReservationTimer.jsx    # Countdown timer
│   │   ├── ReservationConfirm.jsx  # Confirm booking modal
│   │   └── BookingConfirm.jsx      # Success/failure modal
│   ├── styles/
│   │   ├── EventList.css           # Event list styling
│   │   ├── SeatGrid.css            # Seat grid styling
│   │   ├── ReservationTimer.css    # Timer styling
│   │   ├── ReservationConfirm.css  # Modal styling
│   │   └── BookingConfirm.css      # Result modal styling
│   ├── utils/
│   │   └── api.js                  # API service with axios
│   ├── App.tsx                     # Main app component
│   ├── App.css                     # Global styles
│   └── main.tsx                    # Entry point
├── package.json                    # Dependencies
├── vite.config.ts                 # Vite config
└── tsconfig.json                  # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. **Navigate to Backend directory**

   ```bash
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Verify environment variables** (`.env` file)

   ```
   MONGO_CONNECTION_STRING=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   RESERVATION_EXPIRY_MINUTES=10
   ```

4. **Start the backend server**

   ```bash
   npm run dev  # With nodemon for development
   npm start   # Production
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend directory**

   ```bash
   cd Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Initialize Test Data

1. Create events in MongoDB directly or use a MongoDB client:

   ```javascript
   db.events.insertOne({
     name: "Concert 2024",
     date: new Date("2024-12-15"),
     time: "19:00",
     venue: "Madison Square Garden",
     totalSeats: 100,
     seatsPerRow: 10,
   });
   ```

2. Initialize seats for the event using the POST endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/events/initialize/seats \
     -H "Content-Type: application/json" \
     -d '{"eventId": "your_event_id_here"}'
   ```

---

## 📡 API Endpoints

### Events API

**GET /api/events**

- Retrieve all available events
- Returns: Array of events with seat counts

**GET /api/events/:id**

- Retrieve event details with seat grid
- Returns: Event details + seats grouped by row

**POST /api/events/initialize/seats**

- Initialize seats for an event (admin only in production)
- Body: `{ eventId: string }`

### Booking API

**POST /api/reserve**

- Reserve available seats for 10 minutes
- Headers: `x-user-id: string` (optional for demo)
- Body:
  ```json
  {
    "userId": "user_123",
    "eventId": "event_id",
    "seatNumbers": ["A1", "A2"]
  }
  ```
- Returns: Reservation ID + expiration time

**POST /api/bookings**

- Confirm booking and mark seats as booked
- Headers: `x-user-id: string`
- Body:
  ```json
  {
    "reservationId": "reservation_id",
    "userId": "user_123",
    "eventId": "event_id",
    "seatNumbers": ["A1", "A2"]
  }
  ```
- Returns: Success confirmation

**GET /api/reservations/:reservationId**

- Get reservation details with time remaining

**DELETE /api/reservations/:reservationId**

- Cancel reservation and release seats
- Body: `{ userId: "user_123" }`

---

## 🎯 Key Features & Design Decisions

### 1. **Double-Booking Prevention**

- **Approach**: MongoDB Transactions + Atomic Operations
- **Implementation**:
  - Each booking operation runs within a transaction
  - Seats are atomically updated from "available" to "reserved" to "booked"
  - If race condition occurs, transaction is rolled back
  - Prevents multiple users from booking the same seat

### 2. **Reservation Expiry (10 minutes)**

- **Approach**: MongoDB TTL Index + expiration check
- **Implementation**:
  - Each reservation has an `expiresAt` timestamp
  - TTL index automatically removes expired documents
  - Frontend countdown timer alerts users
  - Backend validates expiration before confirming booking

### 3. **Seat Status Management**

- **States**: `available`, `reserved`, `booked`
- **Flow**:
  - Available → Reserved (on reserve API call)
  - Reserved → Booked (on booking confirmation)
  - Reserved → Available (on expiry or cancellation)

### 4. **State Management (Frontend)**

- **React Hooks**: `useState` for local state, `useEffect` for side effects
- **Component Structure**:
  - EventList → SeatGrid → ReservationConfirm → BookingConfirm
  - Unidirectional data flow
  - Error states handled at each component level

### 5. **Authentication (Simplified)**

- **Approach**: User ID via `x-user-id` header
- **Production Note**: Would use JWT tokens with proper user authentication
- **Benefits**: Simple for demo, can be extended to full auth

### 6. **API Error Handling**

- Validation errors with 400 status
- Not found errors with 404 status
- Conflict errors (double booking) with 409 status
- Expired reservation errors with 410 status
- All responses include success flag + message

---

## 🎨 User Experience Flow

1. **User lands on app** → Auto-generated user ID stored in localStorage
2. **Browse events** → Responsive grid of available events
3. **Select event** → View seat grid with color coding:
   - 🟢 Green: Available seats (clickable)
   - 🟠 Orange: Reserved by others
   - 🔴 Red: Already booked
   - 🔵 Blue: Your selection
4. **Select seats** → Click multiple seats to select
5. **Click Reserve** → API call to reserve seats, shows countdown timer
6. **Confirm Booking** → Click confirm before timer expires
7. **Booking confirmation** → Success modal with booked seats

---

## ⚙️ Technical Highlights

### Backend

- ✅ Express.js with async/await
- ✅ MongoDB transactions for ACID compliance
- ✅ Atomic operations for race condition prevention
- ✅ TTL indexes for automatic cleanup
- ✅ Comprehensive error handling
- ✅ CORS enabled for frontend integration

### Frontend

- ✅ React functional components with hooks
- ✅ TypeScript for type safety
- ✅ Responsive CSS Grid layout
- ✅ Countdown timer animations
- ✅ Loading states and error messages
- ✅ Optimistic UI updates
- ✅ Local storage for user persistence

---

## 🧪 Testing the Application

### Test Scenario 1: Normal Booking Flow

1. List events
2. Select an event
3. Select multiple seats
4. Click Reserve
5. Click Confirm Booking
6. Verify success message

### Test Scenario 2: Double Booking Prevention

1. Open app in two browser tabs
2. Both select same seats
3. First to confirm gets the seats
4. Second gets "seats unavailable" error
5. Can select different seats

### Test Scenario 3: Reservation Expiry

1. Reserve seats
2. Wait for 10-minute timer to expire
3. Try to confirm booking
4. Get "reservation expired" error

### Test Scenario 4: Seat Status Updates

1. Reserve seats
2. Refresh page in another tab
3. Reserved seats show orange color
4. Cannot select them

---

## 📊 Database Schema

### Event Document

```javascript
{
  _id: ObjectId,
  name: String,
  date: Date,
  time: String,
  venue: String,
  totalSeats: Number,
  seatsPerRow: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Seat Document

```javascript
{
  _id: ObjectId,
  eventId: ObjectId,
  seatNumber: String,      // e.g., "A1", "B5"
  status: String,          // "available", "reserved", "booked"
  row: String,            // "A", "B", "C"
  column: Number,         // 1, 2, 3...
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation Document

```javascript
{
  _id: ObjectId,
  userId: String,
  eventId: ObjectId,
  seatNumbers: [String],
  status: String,         // "active", "expired", "confirmed"
  expiresAt: Date,        // TTL index for auto-cleanup
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚨 Error Scenarios & Handling

| Scenario                     | Status | Error Message                                           |
| ---------------------------- | ------ | ------------------------------------------------------- |
| Seat unavailable             | 409    | "One or more seats are not available"                   |
| Reservation expired          | 410    | "Reservation has expired"                               |
| Unauthorized booking         | 403    | "Unauthorized: This reservation does not belong to you" |
| Invalid input                | 400    | "Missing required fields"                               |
| Race condition               | 409    | "One or more seats were modified by another user"       |
| Seat modified before booking | 409    | "One or more seats are no longer reserved"              |

---

## 📈 Scalability Considerations

1. **Database Indexes**: Implemented on eventId, seatNumber, expiresAt
2. **TTL Cleanup**: Automatic via MongoDB TTL index
3. **Transaction Support**: Required MongoDB 4.0+ with replica set
4. **Horizontal Scaling**: Stateless backend can scale horizontally
5. **Caching**: Can add Redis for frequently accessed events

---

## 🔐 Security Considerations

1. **Input Validation**: All requests validated
2. **Authentication**: Header-based (can upgrade to JWT)
3. **Authorization**: Verify user ownership of reservations
4. **Rate Limiting**: Should be added in production
5. **HTTPS**: Must be used in production
6. **CORS**: Properly configured for frontend domain

---

## 📝 Assumptions

1. **MongoDB Atlas** is used for database (connection string provided)
2. **User ID** is provided via `x-user-id` header (simplified auth)
3. **Reservation expiry** is fixed at 10 minutes
4. **Seats** are arranged in rows (A, B, C...) and columns (1, 2, 3...)
5. **Single event selection** at a time (no multi-event booking)
6. **No payment processing** (booking confirmation only)
7. **No email notifications** (can be added later)

---

## 🎓 Learning Outcomes

This assignment demonstrates:

- ✅ Full stack development with MERN
- ✅ Database modeling and relationships
- ✅ Transaction handling for data consistency
- ✅ Race condition prevention
- ✅ Responsive UI design
- ✅ API design and error handling
- ✅ State management with React Hooks
- ✅ Real-time updates with countdown timers
- ✅ Component-based architecture

---

## 🔗 Related Files

- **Backend Server**: [Backend/server.js](./Backend/server.js)
- **Frontend App**: [Frontend/src/App.tsx](./Frontend/src/App.tsx)
- **Event API**: [Backend/controllers/eventController.js](./Backend/controllers/eventController.js)
- **Booking Logic**: [Backend/controllers/bookingController.js](./Backend/controllers/bookingController.js)

---

## 📞 Support

For questions or issues, review the code comments and error messages which provide detailed context for each operation.

---

**Ready to test? Start the backend and frontend servers, and happy booking!** 🎉
