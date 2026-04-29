# 🔧 MongoDB Connection Troubleshooting

## Current Issue

Your server is running but cannot connect to MongoDB Atlas:
```
❌ MongoDB Connection Error: Error: querySrv ECONNREFUSED
```

---

## ✅ Quick Fix Options

### Option 1: Verify MongoDB Atlas Connection String

**Your current connection string:**
```
mongodb+srv://khushi_db_user:Khushi%401103@cluster1.cvxxhbc.mongodb.net/thememarket?appName=Cluster1
```

**Steps to verify:**

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com
2. **Click "Database"** in left sidebar
3. **Click "Connect"** on your cluster
4. **Select "Connect your application"**
5. **Copy the EXACT connection string**
6. **Replace the one in `.env` file**

---

### Option 2: Check Network Access (Most Common Issue!)

1. Go to MongoDB Atlas Dashboard
2. Click **"Network Access"** in left sidebar
3. Make sure you see: `0.0.0.0/0` (Allow from anywhere)
4. If not, click **"+ ADD IP ADDRESS"**
5. Select **"ALLOW ACCESS FROM ANYWHERE"**
6. Click **"Confirm"**

⚠️ **This is the #1 reason for connection failures!**

---

### Option 3: Check Database User

1. Go to MongoDB Atlas Dashboard
2. Click **"Database Access"** in left sidebar
3. Verify user `khushi_db_user` exists
4. Check password is correct
5. Make sure it has **Read and Write** permissions

---

### Option 4: Test Connection String Manually

Create a test file to verify connection:

**File:** `backend-simple/test-connection.js`

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
```

Run it:
```bash
node test-connection.js
```

---

### Option 5: Use Different MongoDB Cluster

If the current cluster has issues:

1. Create a NEW cluster in MongoDB Atlas
2. Get the new connection string
3. Update `.env` file
4. Restart server

---

## 🔍 Common Connection String Issues

### Issue 1: Special Characters in Password
Your password contains `@` which must be URL-encoded:
- ❌ Wrong: `Khushi@1103`
- ✅ Correct: `Khushi%401103` (already done!)

### Issue 2: Wrong Cluster Name
Check your actual cluster name in MongoDB Atlas dashboard.

### Issue 3: Missing Database Name
Should be: `...mongodb.net/thememarket?...`

---

## 📋 Checklist

- [ ] MongoDB Atlas cluster is created and running
- [ ] Database user created with correct password
- [ ] Network access allows 0.0.0.0/0 (all IPs)
- [ ] Connection string copied correctly from Atlas
- [ ] Password is URL-encoded (special characters)
- [ ] Database name included in connection string
- [ ] No extra spaces in `.env` file

---

## 🧪 Alternative: Use Local MongoDB (Temporary)

If MongoDB Atlas keeps failing, you can test with local MongoDB:

1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Update `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/thememarket
   ```
3. Restart server: `npm start`

---

## 📞 What to Share If You Need Help

If still not working, share:
1. Screenshot of MongoDB Atlas "Connect" modal (connection string)
2. Screenshot of "Network Access" page
3. Error message from terminal

---

## ✅ Success Looks Like

When connected, you should see:
```
🚀 Server running on http://localhost:3003
✅ MongoDB Connected Successfully
✅ Default admin created: admin@thememarket.com / admin123
```

---

**The server IS running on port 3003, it just can't connect to MongoDB yet. Once the connection is fixed, everything will work!** 🎯
