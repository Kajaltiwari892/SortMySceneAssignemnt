# 🔧 Troubleshooting & Fixes

## ❌ Problem 1: "No Events Available" on Dashboard

### **Cause:** Database has no events

### **Solution:**

**Step 1:** Run the seed script

```bash
cd Backend
npm run seed
```

**Expected Output:**

```
✅ Connected to MongoDB
✅ Created 4 events
✅ Created 750 seats
🎉 Database seeded successfully!
```

**Step 2:** Restart backend if running

```bash
npm run dev
```

**Step 3:** Refresh frontend (F5)

---

## ❌ Problem 2: Backend Shows Error "MongoDB Connection Failed"

### **Cause:** MongoDB connection string invalid or network issue

### **Solution:**

**Check 1:** Verify .env file

```bash
cd Backend
cat .env
```

Should contain:

```
MONGO_CONNECTION_STRING=mongodb://kajalkumari55567w_db_user:kajal12345@ac-kbymvob-shard-00-00.ozoeuul.mongodb.net:...
```

**Check 2:** Test MongoDB connection

```bash
# Install MongoDB CLI (optional)
# or just try to seed
npm run seed
```

**Check 3:** If still fails

- Check MongoDB Atlas: https://cloud.mongodb.com
- Verify connection string is correct
- Add your IP to IP whitelist in MongoDB Atlas

---

## ❌ Problem 3: Frontend Shows "Error: Could not connect to API"

### **Cause:** Backend not running or CORS issue

### **Solution:**

**Check 1:** Is backend running?

```bash
curl http://localhost:5000/health
```

Should return: `{"message":"Server is running"}`

If not, start backend:

```bash
cd Backend
npm run dev
```

**Check 2:** Check API URL in frontend

```bash
cat Frontend/src/utils/api.js
```

Should have:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

**Check 3:** Check browser console (F12)

- Look for CORS errors
- Check Network tab for failed requests

---

## ❌ Problem 4: "Cannot find module 'express'" Error

### **Cause:** npm dependencies not installed

### **Solution:**

```bash
cd Backend
npm install
```

Wait for completion. Should see:

```
added XX packages
```

Then try again:

```bash
npm run dev
```

---

## ❌ Problem 5: Port Already in Use (EADDRINUSE)

### **Cause:** Backend or frontend port already taken

### **Solution:**

**Option 1: Kill existing process**

On Windows (PowerShell):

```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F

# Then restart
npm run dev
```

On Mac/Linux:

```bash
# Find process
lsof -i :5000

# Kill it (replace PID)
kill -9 <PID>

# Then restart
npm run dev
```

**Option 2: Change port**

Backend - Edit `.env`:

```
PORT=5001  # Changed from 5000
```

Frontend - Edit `src/utils/api.js`:

```javascript
const API_BASE_URL = "http://localhost:5001/api";
```

---

## ❌ Problem 6: Seats Not Loading After Selecting Event

### **Cause:** Event exists but has no seats

### **Solution:**

**Step 1:** Reseed database (clears & recreates)

```bash
cd Backend
npm run seed
```

**Step 2:** Refresh frontend (F5)

**Step 3:** Try selecting event again

---

## ❌ Problem 7: Reservation Expires Immediately

### **Cause:** Clock skew between client and server

### **Solution:**

**Check 1:** Verify system time is correct

- Windows: Right-click clock → Adjust date/time
- Mac: System Preferences → Date & Time
- Linux: `date` command

**Check 2:** Check RESERVATION_EXPIRY_MINUTES in Backend/.env

```
RESERVATION_EXPIRY_MINUTES=10
```

Should be 10 (minutes)

---

## ❌ Problem 8: "Seats Are Not Available" When Trying to Reserve

### **Cause:** Another user just booked same seats

### **Solution:**

This is normal! Select different seats:

**Step 1:** Go back

```
Click: ← Back to Events
```

**Step 2:** Select event again

```
Click: Same event
```

**Step 3:** Select different seats

```
Click: Different available seats (🟢 green)
```

**Step 4:** Reserve again

```
Click: Reserve Selected Seats
```

---

## ❌ Problem 9: "Reservation Has Expired" Error

### **Cause:** Took too long to confirm booking (>10 minutes)

### **Solution:**

**Step 1:** Reserve seats again

```
Click: Reserve Selected Seats
```

**Step 2:** Confirm within 10 minutes

```
Watch timer: ⏱️ 10:00 → ... → 00:00
Click: Confirm Booking BEFORE timer reaches 0
```

**Tip:** If you need more time, contact admin to increase `RESERVATION_EXPIRY_MINUTES` in Backend/.env

---

## ❌ Problem 10: "User ID: undefined" or Not Showing

### **Cause:** localStorage not initialized

### **Solution:**

**Step 1:** Hard refresh frontend

```
Ctrl + Shift + Delete  (Windows/Linux)
Cmd + Shift + Delete   (Mac)
```

**Step 2:** Clear cache and reload

- In DevTools (F12)
- Go to Application tab
- Clear All Site Data
- Reload page

**Step 3:** Manual check in console (F12)

```javascript
// Type this in console:
localStorage.getItem("userId");
```

Should return a user ID like: `user_1734689235_k8x9p2`

---

## ✅ Verify Everything is Working

### **Quick Health Check:**

```bash
# Terminal 1: Check Backend
curl http://localhost:5000/health
# Expected: {"message":"Server is running"}

# Terminal 1: Check Events API
curl http://localhost:5000/api/events
# Expected: {"success":true,"data":[...4 events]}

# Browser: Check Frontend
http://localhost:5173
# Expected: 4 events displayed
```

---

## 🛠️ Debug Mode

### **Enable Verbose Logging**

**Backend:** Edit `server.js` and add:

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend:** Edit `src/utils/api.js` and add:

```javascript
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.data);
    return response.data;
  },
  (error) => {
    console.log("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);
```

---

## 📋 Pre-Flight Checklist

Before reporting issue, verify:

- [ ] Backend running on port 5000?

  ```bash
  curl http://localhost:5000/health
  ```

- [ ] Frontend running on port 5173?

  ```bash
  # Browser: http://localhost:5173
  ```

- [ ] MongoDB connected?

  ```bash
  # Backend logs should show: "MongoDB Connected"
  ```

- [ ] Events in database?

  ```bash
  npm run seed
  ```

- [ ] npm modules installed?

  ```bash
  cd Backend && npm install
  cd Frontend && npm install
  ```

- [ ] .env file exists with valid connection string?
  ```bash
  cat Backend/.env
  ```

---

## 🆘 Still Not Working?

### **Step 1: Collect Information**

Run these commands and note output:

```bash
# Backend check
cd Backend
echo "=== Backend Version ==="
npm list express
echo "=== Node Version ==="
node --version
echo "=== .env Exists ==="
test -f .env && echo "✅ .env exists" || echo "❌ .env missing"
echo "=== Try seed ==="
npm run seed 2>&1 | head -20

# Frontend check
cd ../Frontend
echo "=== npm list ==="
npm list react 2>&1 | head -10
```

### **Step 2: Full Fresh Start**

```bash
# Backend
cd Backend
rm -rf node_modules package-lock.json
npm install
npm run seed
npm run dev

# Frontend (new terminal)
cd Frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Step 3: Check Browser Console**

Open: http://localhost:5173

- Press: F12
- Tab: Console
- Look for red errors
- Screenshot and share

---

## 📞 Support Resources

- **MongoDB Issue?** → https://docs.mongodb.com/
- **Express Issue?** → https://expressjs.com/
- **React Issue?** → https://react.dev/
- **Vite Issue?** → https://vitejs.dev/

---

**Remember:** Most issues are related to:

1. ❌ Database not seeded (no events)
2. ❌ Backend not running
3. ❌ npm modules not installed
4. ❌ Ports already in use

Run `npm run seed` and restart both servers if unsure! 🚀
