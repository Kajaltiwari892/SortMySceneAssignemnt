# Event Booking Backend - Setup Guide

## 📋 Overview

This is the backend server for the Event Ticket Booking System built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Navigate to Backend directory**

   ```bash
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Verify .env file**
   The `.env` file should contain:

   ```
   MONGO_CONNECTION_STRING=mongodb://kajalkumari55567w_db_user:kajal12345@ac-kbymvob-shard-00-00.ozoeuul.mongodb.net:27017,ac-kbymvob-shard-00-01.ozoeuul.mongodb.net:27017,ac-kbymvob-shard-00-02.ozoeuul.mongodb.net:27017/resumeai?ssl=true&replicaSet=atlas-9glxsc-shard-0&authSource=admin&appName=Cluster0
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   RESERVATION_EXPIRY_MINUTES=10
   ```

4. **Start the server**

   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
Backend/
├── models/
│   ├── Event.js          # Event schema
│   ├── Seat.js           # Seat schema with status tracking
│   └── Reservation.js    # Reservation schema with TTL
├── controllers/
│   ├── eventController.js    # Event management logic
│   └── bookingController.js  # Reservation & booking logic
├── routes/
│   ├── eventRoutes.js    # Event endpoints
│   └── bookingRoutes.js  # Booking endpoints
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── errorHandler.js   # Error handling
├── server.js             # Express server setup
├── db.js                 # MongoDB connection
├── package.json
├── .env
└── .gitignore
```

## 🔌 API Endpoints

### GET /api/events

Get all available events

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "event_id",
      "name": "Concert 2024",
      "date": "2024-12-15T00:00:00.000Z",
      "time": "19:00",
      "venue": "Madison Square Garden",
      "totalSeats": 100
    }
  ]
}
```

### GET /api/events/:id

Get event details with seat grid

**Response:**

```json
{
  "success": true,
  "data": {
    "event": {
      /* event details */
    },
    "seats": {
      "A": [
        /* seat objects */
      ],
      "B": [
        /* seat objects */
      ]
    },
    "totalSeats": 100,
    "availableSeats": 85,
    "bookedSeats": 10,
    "reservedSeats": 5
  }
}
```

### POST /api/reserve

Reserve seats

**Request:**

```json
{
  "userId": "user_123",
  "eventId": "event_id",
  "seatNumbers": ["A1", "A2", "B3"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Seats reserved successfully",
  "data": {
    "reservationId": "reservation_id",
    "seatNumbers": ["A1", "A2", "B3"],
    "expiresAt": "2024-12-20T15:30:00Z",
    "expiresInSeconds": 600
  }
}
```

### POST /api/bookings

Confirm booking

**Request:**

```json
{
  "reservationId": "reservation_id",
  "userId": "user_123",
  "eventId": "event_id",
  "seatNumbers": ["A1", "A2", "B3"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "reservationId": "reservation_id",
    "seatNumbers": ["A1", "A2", "B3"],
    "status": "confirmed"
  }
}
```

### GET /api/reservations/:reservationId

Get reservation details

### DELETE /api/reservations/:reservationId

Cancel reservation

## 🔐 Authentication

Currently uses simplified header-based authentication:

```bash
curl -H "x-user-id: user_123" http://localhost:5000/api/events
```

In production, upgrade to JWT tokens.

## 📊 Data Models

### Event

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

### Seat

```javascript
{
  _id: ObjectId,
  eventId: ObjectId,
  seatNumber: String,   // "A1", "B5"
  status: String,       // "available", "reserved", "booked"
  row: String,          // "A", "B", "C"
  column: Number,       // 1, 2, 3...
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation

```javascript
{
  _id: ObjectId,
  userId: String,
  eventId: ObjectId,
  seatNumbers: [String],
  status: String,        // "active", "expired", "confirmed"
  expiresAt: Date,       // TTL index
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Double-Booking Prevention

The backend uses **MongoDB Transactions** and **Atomic Operations** to prevent double booking:

1. Each booking operation runs within a transaction
2. Seats are atomically updated (available → reserved → booked)
3. If race condition occurs, transaction is rolled back
4. Expired reservations are automatically cleaned up via TTL index

## ⚙️ Technology Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request parsing
- **Dotenv** - Environment variables

## 🧪 Testing

### Create Sample Event

```bash
curl -X POST http://localhost:5000/api/events/initialize/seats \
  -H "Content-Type: application/json" \
  -d '{"eventId": "YOUR_EVENT_ID"}'
```

### Reserve Seats

```bash
curl -X POST http://localhost:5000/api/reserve \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "userId": "user_123",
    "eventId": "event_id",
    "seatNumbers": ["A1", "A2"]
  }'
```

### Confirm Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "reservationId": "reservation_id",
    "userId": "user_123",
    "eventId": "event_id",
    "seatNumbers": ["A1", "A2"]
  }'
```

## 📝 Error Handling

| Status | Error                       | Meaning                   |
| ------ | --------------------------- | ------------------------- |
| 400    | Missing required fields     | Validation error          |
| 404    | Event/Reservation not found | Resource doesn't exist    |
| 409    | Seats are not available     | Conflict (double booking) |
| 410    | Reservation has expired     | Resource no longer valid  |
| 403    | Unauthorized                | User doesn't own resource |
| 500    | Internal Server Error       | Server error              |

## 🔄 Request Flow

1. Client selects seats
2. Client calls `POST /api/reserve`
3. Backend validates & reserves seats in transaction
4. Returns reservation ID with expiry time
5. Client starts countdown timer
6. Client calls `POST /api/bookings` to confirm
7. Backend validates reservation & confirms booking
8. Returns success/failure

## 🐛 Debugging

Enable detailed logging:

```bash
NODE_ENV=development npm run dev
```

Check MongoDB connection in logs:

```
MongoDB Connected: ac-kbymvob-shard-00-00.ozoeuul.mongodb.net
```

## 📚 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ORM
- `cors` - CORS middleware
- `body-parser` - Request parsing
- `dotenv` - Environment variables
- `nodemon` - Auto-restart on changes (dev only)

## 🚀 Production Checklist

- [ ] Use environment-specific .env files
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Upgrade to JWT authentication
- [ ] Add input validation
- [ ] Set up MongoDB backups
- [ ] Enable MongoDB monitoring
- [ ] Add request logging
- [ ] Deploy to production server

---

**Ready to roll? Start the server and begin booking!** 🎉
