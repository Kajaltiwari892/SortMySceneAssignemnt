# 🎯 START HERE - 5 Minutes to Working App

## ⚡ The Quickest Way to Get Events Showing

### **Problem:**

"No events available" on dashboard

### **Solution:**

Populate database with sample events

---

## 🚀 Do This NOW (Copy & Paste):

### **Terminal 1 - Setup Backend:**

```bash
cd Backend
npm install
npm run seed
npm run dev
```

**Wait until you see:**

```
✅ Database seeded successfully!
Server is running on port 5000
MongoDB Connected
```

### **Terminal 2 - Start Frontend:**

```bash
cd Frontend
npm install
npm run dev
```

**Wait until you see:**

```
VITE v5.0.0 ready in 123 ms
➜  Local:   http://localhost:5173/
```

### **Then Open:**

```
http://localhost:5173
```

---

## ✅ What You'll See

**Immediately after:**

```
🎬 Event Ticket Booking System
User ID: user_1734689235_k8x9p2...

Available Events:
┌────────────────────────────┐
│ Marvel Concert 2024        │
│ Dec 20, 2024 - 19:00      │
│ Madison Square Garden      │
│ Total Seats: 100           │
│ [Select Event]             │
└────────────────────────────┘

┌────────────────────────────┐
│ Tech Conference 2025       │
│ Jan 15, 2025 - 09:00      │
│ Convention Center, SF      │
│ Total Seats: 200           │
│ [Select Event]             │
└────────────────────────────┘

┌────────────────────────────┐
│ Sports Championship        │
│ Dec 25, 2024 - 20:00      │
│ Staples Center, LA         │
│ Total Seats: 150           │
│ [Select Event]             │
└────────────────────────────┘

┌────────────────────────────┐
│ Music Festival 2024        │
│ Dec 28, 2024 - 18:00      │
│ Central Park, NY           │
│ Total Seats: 300           │
│ [Select Event]             │
└────────────────────────────┘
```

---

## 🎬 Then Test the Full Flow:

1. **Click any event** → See seat grid
2. **Click seats** → They turn blue (selected)
3. **Click "Reserve Selected Seats"** → See countdown timer
4. **Click "Confirm Booking"** → See success message
5. **Click "Continue"** → Back to events

---

## ❌ Still No Events?

### **Run This to Fix:**

```bash
cd Backend
npm run seed
```

Should output:

```
✅ Created 4 events
✅ Created 750 seats
🎉 Database seeded successfully!
```

Then refresh browser (F5)

---

## 🆘 If That Doesn't Work:

### **Check Backend is Running:**

```bash
curl http://localhost:5000/health
```

Should show: `{"message":"Server is running"}`

### **Check MongoDB Connection:**

Look at Backend terminal output. Should show:

```
MongoDB Connected: ac-kbymvob-shard-00-00.ozoeuul.mongodb.net
```

### **Check Events in Database:**

```bash
curl http://localhost:5000/api/events
```

Should show JSON with 4 events

---

## 📚 More Information:

- **Full Setup Guide:** See `END_TO_END_SETUP.md`
- **Troubleshooting:** See `TROUBLESHOOTING.md`
- **Project Docs:** See `README.md`
- **Backend API:** See `Backend/README.md`
- **Frontend Components:** See `Frontend/README.md`

---

## ✨ Files Created for You:

- ✅ `Backend/seed.js` - Creates 4 sample events with 750 seats
- ✅ `Backend/package.json` - Added `npm run seed` script
- ✅ `QUICK_START.md` - This file
- ✅ `END_TO_END_SETUP.md` - Complete flow diagram
- ✅ `TROUBLESHOOTING.md` - Fixes for common issues

---

## 🎉 That's It!

You now have:

- ✅ 4 ready-to-book events
- ✅ 750 selectable seats
- ✅ Real-time seat status
- ✅ 10-minute reservation timer
- ✅ Full end-to-end booking flow

**Start booking now!** 🚀

---

**Questions?** Check:

1. Backend running? → `npm run dev` in Backend folder
2. Frontend running? → `npm run dev` in Frontend folder
3. Database seeded? → `npm run seed` in Backend folder
4. Events showing? → Refresh http://localhost:5173
