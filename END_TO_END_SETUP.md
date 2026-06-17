
## 📁 Complete Project Structure

```
SortMySceneAssignKajal/
├── Backend/                              # Node.js + Express + MongoDB
│   ├── models/
│   │   ├── Event.js                     # Event schema (name, date, venue, totalSeats)
│   │   ├── Seat.js                      # Seat schema (status: available/reserved/booked)
│   │   └── Reservation.js               # Reservation schema (10-min expiry)
│   ├── controllers/
│   │   ├── eventController.js           # Fetch events, initialize seats
│   │   └── bookingController.js         # Reserve seats, confirm booking
│   ├── routes/
│   │   ├── eventRoutes.js               # GET /api/events, GET /api/events/:id
│   │   └── bookingRoutes.js             # POST /api/reserve, POST /api/bookings
│   ├── middleware/
│   │   ├── auth.js                      # x-user-id header validation
│   │   └── errorHandler.js              # Global error handling
│   ├── .env                             # MongoDB connection & secrets
│   ├── server.js                        # Express app setup
│   ├── db.js                            # MongoDB connection
│   ├── seed.js                          # 🆕 Create sample events & seats
│   └── package.json
│
├── Frontend/                             # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventList.jsx           # Browse events
│   │   │   ├── SeatGrid.jsx            # Select seats with color coding
│   │   │   ├── ReservationTimer.jsx    # 10-minute countdown
│   │   │   ├── ReservationConfirm.jsx  # Confirm booking modal
│   │   │   └── BookingConfirm.jsx      # Success/failure modal
│   │   ├── styles/
│   │   │   ├── EventList.css           # Event cards grid
│   │   │   ├── SeatGrid.css            # Seat visualization
│   │   │   ├── ReservationTimer.css    # Countdown styling
│   │   │   ├── ReservationConfirm.css  # Modal styling
│   │   │   └── BookingConfirm.css      # Result modal styling
│   │   ├── utils/
│   │   │   └── api.js                  # Axios API client
│   │   ├── App.tsx                     # Main app component
│   │   ├── App.css                     # Global styles
│   │   └── main.tsx                    # Entry point
│   └── package.json
│
├── README.md                             # Main project documentation
├── Backend/README.md                     # Backend API docs
├── Frontend/README.md                    # Frontend component docs
└── QUICK_START.md                        #  Quick setup guide
```

---

## 🔄 Complete End-to-End Flow

### **1. Database Setup (MongoDB)**

```
┌─────────────────────────────────────┐
│ MongoDB Atlas (Cloud)               │
│                                     │
│ Collections:                        │
│ ├─ events (4 documents)            │
│ ├─ seats (750 documents)           │
│ └─ reservations (for bookings)     │
└─────────────────────────────────────┘
```

### **2. Backend Server Flow**

```
User Request
     ↓
Express Server (port 5000)
     ↓
CORS Middleware ✓
     ↓
Routes:
├─ GET /api/events → eventController.getAllEvents()
│                   → Query DB → Return all events
│
├─ GET /api/events/:id → eventController.getEventById()
│                       → Query seats by eventId
│                       → Group by rows → Return
│
├─ POST /api/reserve → bookingController.reserveSeats()
│                     → Transaction: Update seats to "reserved"
│                     → Create reservation with 10-min expiry
│
└─ POST /api/bookings → bookingController.confirmBooking()
                       → Validate reservation not expired
                       → Transaction: Update seats to "booked"
```

### **3. Frontend Component Flow**

```
App (State Management)
├─ useEffect: Initialize userId
├─ useEffect: Set API headers
│
├─ EventList Component
│   └─ Display all events
│   └─ Click event → Select
│
├─ SeatGrid Component
│   └─ API call: GET /api/events/:id
│   └─ Display colored seats
│   └─ Click seats → Select
│
├─ ReservationConfirm Component
│   ├─ API call: POST /api/reserve
│   ├─ Start countdown timer
│   ├─ User decides: Confirm or Cancel
│   └─ API call: POST /api/bookings
│
└─ BookingConfirm Modal
    └─ Show success/error
```

---

## 🌱 Seed Database Setup

### **What `seed.js` Does:**

1. **Connects to MongoDB** using MONGO_CONNECTION_STRING
2. **Clears old data** (fresh start)
3. **Creates 4 sample events:**
   - Marvel Concert 2024 (100 seats)
   - Tech Conference 2025 (200 seats)
   - Sports Championship (150 seats)
   - Music Festival 2024 (300 seats)
4. **Creates all seats:**
   - Arranged by rows (A, B, C...)
   - Each seat has: seatNumber, status, row, column
   - All start as "available"

### **Run Seed Once:**

```bash
cd Backend
npm run seed
```

---

## 🚀 Installation & Startup (Step-by-Step)

### **Step 1: Install Backend Dependencies**

```bash
cd Backend
npm install
```

**What it installs:**

- `express` - Web framework
- `mongoose` - MongoDB ORM
- `cors` - Cross-origin support
- `body-parser` - Request parsing
- `dotenv` - Environment variables
- `nodemon` - Dev server auto-reload

### **Step 2: Seed Sample Data**

```bash
npm run seed
```

**Output:**

```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created 4 events
✅ Created 750 seats for all events
🎉 Database seeded successfully!
```

### **Step 3: Start Backend Server**

```bash
npm run dev
```

**Output:**

```
Server is running on port 5000
MongoDB Connected: ac-kbymvob-shard-00-00.ozoeuul.mongodb.net
```

### **Step 4: Install Frontend Dependencies (New Terminal)**

```bash
cd Frontend
npm install
```

**What it installs:**

- `react@19.2.6` - UI library
- `react-dom@19.2.6` - DOM rendering
- `axios@1.6.0` - HTTP client
- `vite@8.0.12` - Build tool

### **Step 5: Start Frontend Server**

```bash
npm run dev
```

**Output:**

```
VITE v5.0.0 ready in 123 ms

➜  Local:   http://localhost:5173/
```

---

## ✅ Verify End-to-End Setup

### **1. Check Backend Health**

```bash
curl http://localhost:5000/health
```

**Expected:** `{"message":"Server is running"}`

### **2. Check Events API**

```bash
curl http://localhost:5000/api/events
```

**Expected:** JSON array with 4 events

### **3. Open Frontend**

Go to: **http://localhost:5173**

**Expected:**

- ✅ 4 Events displayed
- ✅ User ID shown in header
- ✅ No error messages

---

## 🎯 Complete User Journey

### **User Lands on App**

```
✅ Browser: http://localhost:5173
✅ App loads
✅ localStorage: userId generated & stored
✅ API: setUserId() adds to headers
✅ API: GET /api/events called
✅ Display: EventList shows 4 events
```

### **User Selects Event**

```
✅ Click: Event card
✅ State: selectedEventId updated
✅ Display: Switch to SeatGrid
✅ API: GET /api/events/:id called
✅ Display: Colored seat grid shown
```

### **User Selects Seats**

```
✅ Click: Multiple seat buttons (🟢 green)
✅ State: selectedSeats updated
✅ Display: Selected seats turn 🔵 blue
✅ Count: "Selected Seats: 3" shown
```

### **User Reserves Seats**

```
✅ Click: "Reserve Selected Seats" button
✅ API: POST /api/reserve called
✅ Backend: Transaction starts
├─ Check: All seats are available
├─ Update: Seats status → "reserved"
├─ Create: Reservation document
└─ Transaction: Commit/Rollback
✅ Response: reservationId + 600 seconds
✅ Display: ReservationConfirm modal
✅ Timer: Countdown starts (10:00)
```

### **User Confirms Booking**

```
✅ Timer: Running down (⏱️ 09:45)
✅ Click: "Confirm Booking" button
✅ API: POST /api/bookings called
✅ Backend: Transaction starts
├─ Validate: Reservation not expired
├─ Validate: User owns reservation
├─ Update: Seats status → "booked"
└─ Transaction: Commit/Rollback
✅ Response: Success
✅ Display: BookingConfirm modal
✅ Message: "Your booking has been confirmed!"
```

### **Back to Event Selection**

```
✅ Click: "Continue" button
✅ Display: Back to EventList
✅ Ready: Select new event or refresh
```

---

## 🔧 Configuration Files

### **Backend/.env**

```
MONGO_CONNECTION_STRING=mongodb://kajalkumari55567w_db_user:kajal12345@...
PORT=5000
NODE_ENV=development
JWT_SECRET=hQ8$mK2@pL9vN5xR7tY3wZ0bC6fD1eJ4gH8sU2iO9aP5kL7mN3oQ1rS4tU6vW8xY9z
RESERVATION_EXPIRY_MINUTES=10
```

### **Frontend/src/utils/api.js**

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

---

## 🎨 UI/UX Features

### **Event List Page**

- Responsive grid (1-3 columns)
- Event cards with details
- Hover effects
- Click to select

### **Seat Grid Page**

- Color-coded seats
  - 🟢 Green: Available
  - 🟠 Orange: Reserved by others
  - 🔴 Red: Already booked
  - 🔵 Blue: Your selection
- Row labels (A, B, C...)
- Seat count display
- "Reserve Selected Seats" button

### **Reservation Modal**

- Countdown timer (MM:SS)
- Red warning when < 1 min
- Blinking animation
- Confirm / Cancel buttons

### **Booking Result Modal**

- Success: ✓ Green
- Error: ✗ Red
- Seat details
- Close button

---

## 🐛 Common Issues & Solutions

| Issue                    | Cause                     | Solution                       |
| ------------------------ | ------------------------- | ------------------------------ |
| No events showing        | Database empty            | Run `npm run seed`             |
| Can't connect to backend | Backend not running       | Run `npm run dev` in Backend   |
| CORS error               | Frontend/backend mismatch | Check `API_BASE_URL` in api.js |
| Reservation expired      | Timer ran out             | Reserve again                  |
| "Seats unavailable"      | Another user booked       | Select different seats         |
| "Reserved by others"     | Existing reservation      | Refresh page for latest status |

---

## 📊 Database Schema

### Events Collection

```javascript
{
  _id: ObjectId,
  name: "Marvel Concert 2024",
  date: Date,
  time: "19:00",
  venue: "Madison Square Garden",
  totalSeats: 100,
  seatsPerRow: 10,
  createdAt: Date,
  updatedAt: Date
}
```

### Seats Collection

```javascript
{
  _id: ObjectId,
  eventId: ObjectId,
  seatNumber: "A1",
  status: "available" | "reserved" | "booked",
  row: "A",
  column: 1,
  createdAt: Date,
  updatedAt: Date
}
```

### Reservations Collection

```javascript
{
  _id: ObjectId,
  userId: "user_123_abc",
  eventId: ObjectId,
  seatNumbers: ["A1", "A2"],
  status: "active" | "expired" | "confirmed",
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ You're Ready!

Once you see 4 events on the dashboard:

- ✅ Backend working
- ✅ Frontend working
- ✅ Database connected
- ✅ Ready to book tickets!

**Start booking now!** 🎉
