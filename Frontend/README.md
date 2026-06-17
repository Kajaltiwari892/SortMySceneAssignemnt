# Event Booking Frontend - Setup Guide

## 📋 Overview

This is the frontend application for the Event Ticket Booking System built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

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

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── EventList.jsx           # Display available events
│   │   ├── SeatGrid.jsx            # Seat selection
│   │   ├── ReservationTimer.jsx    # Countdown timer
│   │   ├── ReservationConfirm.jsx  # Booking confirmation modal
│   │   └── BookingConfirm.jsx      # Success/failure modal
│   ├── styles/
│   │   ├── EventList.css           # Event list styling
│   │   ├── SeatGrid.css            # Seat grid styling
│   │   ├── ReservationTimer.css    # Timer styling
│   │   ├── ReservationConfirm.css  # Modal styling
│   │   └── BookingConfirm.css      # Result modal styling
│   ├── utils/
│   │   └── api.js                  # API service
│   ├── App.tsx                     # Main component
│   ├── App.css                     # Global styles
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Base styles
├── public/                         # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## 🎨 Component Architecture

```
App (State Management)
├── EventList (Browse events)
├── SeatGrid (Select seats)
├── ReservationConfirm (Countdown & confirm)
│   └── ReservationTimer (10-minute countdown)
└── BookingConfirm (Success/Failure modal)
```

## 🔄 User Flow

1. **App Initialization**
   - Generate or retrieve user ID from localStorage
   - Display EventList component

2. **Event Selection**
   - User clicks on an event card
   - Navigate to SeatGrid component

3. **Seat Selection**
   - User clicks seats to select/deselect
   - Multiple seats can be selected
   - Selected seats are highlighted in blue

4. **Reserve Seats**
   - Click "Reserve Selected Seats" button
   - API call to `/api/reserve`
   - Display ReservationConfirm modal

5. **Confirm Booking**
   - ReservationTimer starts (10 minutes)
   - User can confirm or cancel
   - Confirm → API call to `/api/bookings`
   - Display BookingConfirm modal

6. **Booking Complete**
   - Show success or error message
   - Reset to event selection

## 🛠️ Key Features

### Event List Component

- Displays all available events in a responsive grid
- Shows event details (name, date, time, venue, capacity)
- Click to select an event
- Selected event is highlighted

### Seat Grid Component

- Displays seats arranged by rows (A, B, C, etc.)
- Color-coded seat statuses:
  - 🟢 Green: Available
  - 🟠 Orange: Reserved by others
  - 🔴 Red: Already booked
  - 🔵 Blue: Your selection
- Click seats to select/deselect
- Shows count of available, reserved, and booked seats
- Disabled seats cannot be clicked

### Reservation Timer

- Shows remaining time (MM:SS format)
- Animated countdown
- Turns red and pulses when less than 1 minute left
- Auto-cancels when expired

### Error Handling

- Displays error messages globally
- Specific errors per component
- API errors are caught and displayed
- Validation errors for empty selections

## 🔌 API Integration

### getEvents()

Fetches all available events

### getEventById(eventId)

Fetches event details with seat grid

### reserveSeats(userId, eventId, seatNumbers)

Reserve seats for 10 minutes

### confirmBooking(reservationId, userId, eventId, seatNumbers)

Confirm booking and mark seats as booked

### cancelReservation(reservationId, userId)

Cancel a reservation

### getReservation(reservationId)

Get reservation details with time remaining

## 🎨 Styling

### Global Styles (App.css)

- Gradient background
- Header with title
- Main content area
- Footer
- Responsive layout

### Component Styles

- **EventList.css**: Grid layout for event cards
- **SeatGrid.css**: Flexible seat grid with row labels
- **ReservationTimer.css**: Countdown display with animations
- **ReservationConfirm.css**: Modal dialog styling
- **BookingConfirm.css**: Success/failure modal styling

### Color Scheme

- Primary: Purple (#667eea)
- Accent: Dark Purple (#764ba2)
- Success: Green (#4caf50)
- Warning: Orange (#ff9800)
- Error: Red (#f44336)

## 📱 Responsive Design

The application is fully responsive with breakpoints at:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🧪 Testing the Application

### Test Case 1: Normal Flow

1. App loads, auto-generate user ID
2. EventList shows all events
3. Click an event to select
4. See seat grid with colored seats
5. Click seats to select
6. Click "Reserve Selected Seats"
7. See countdown timer
8. Click "Confirm Booking"
9. See success message

### Test Case 2: Multiple Selections

1. Select same event in two browser tabs
2. Select same seats in both tabs
3. First user confirms successfully
4. Second user gets "seats unavailable" error
5. Second user can select different seats

### Test Case 3: Expiration

1. Reserve seats
2. Wait 10 minutes (or watch the countdown)
3. Try to confirm booking
4. Get "reservation expired" error

### Test Case 4: Cancellation

1. Reserve seats
2. Click "Cancel Reservation"
3. Reservation is cancelled
4. Seats become available again

## 🔧 Configuration

### API Base URL

Edit `src/utils/api.js`:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

### Update for different backend URL

```javascript
const API_BASE_URL = "https://your-backend.com/api";
```

## 📦 Dependencies

- `react@^19.2.6` - UI library
- `react-dom@^19.2.6` - React DOM rendering
- `axios@^1.6.0` - HTTP client
- `vite@^8.0.12` - Build tool
- `typescript@~6.0.2` - TypeScript support

## ⚙️ Development

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run linter

```bash
npm run lint
```

### Environment Setup

The application automatically:

1. Generates a unique user ID if not present
2. Stores it in localStorage
3. Persists it across sessions

## 🐛 Troubleshooting

### API Connection Error

- Ensure backend is running on `http://localhost:5000`
- Check CORS is enabled on backend
- Verify network connection

### Seats Not Loading

- Check browser console for errors
- Verify event has seats initialized
- Make sure event ID is valid

### Timer Not Updating

- Check if reservation is still active
- Verify browser supports modern JavaScript
- Clear browser cache

### Styling Issues

- Clear browser cache
- Run `npm run build` for production
- Check if CSS files are loading

## 📚 Component Documentation

### EventList

```jsx
<EventList
  onSelectEvent={(eventId) => {...}}
  selectedEventId={selectedEventId}
/>
```

### SeatGrid

```jsx
<SeatGrid
  eventId={eventId}
  selectedSeats={selectedSeats}
  onSeatSelect={(seatNumber) => {...}}
  onReserve={() => {...}}
/>
```

### ReservationTimer

```jsx
<ReservationTimer
  expiresInSeconds={600}
  onExpire={() => {...}}
/>
```

### ReservationConfirm

```jsx
<ReservationConfirm
  reservation={reservation}
  selectedSeats={selectedSeats}
  onConfirmBooking={() => {...}}
  onCancel={() => {...}}
  isLoading={false}
  error={null}
/>
```

### BookingConfirm

```jsx
<BookingConfirm
  status="success"
  message="Booking confirmed!"
  seatNumbers={["A1", "A2"]}
  onClose={() => {...}}
/>
```

## 🔐 User Session

User ID is automatically managed:

- Generated on first visit: `user_{timestamp}_{random}`
- Stored in localStorage
- Sent with each API request via header
- Can be viewed in app header

## 🚀 Production Deployment

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to Vercel

```bash
npm run build
# Connect to Vercel and deploy
```

### Environment Variables (Production)

```
VITE_API_BASE_URL=https://your-backend.com/api
```

Update `src/utils/api.js`:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
```

---

**Happy booking!** 🎉

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
