# ThemeMarket Backend Setup Guide

## 🚀 Quick Start

### Prerequisites
1. **Node.js** (v14 or higher) - Already installed ✅
2. **MongoDB** - Need to install (see options below)

---

## 📦 MongoDB Setup Options

### Option 1: MongoDB Atlas (Cloud - RECOMMENDED & EASIEST)
**Free tier available, no installation needed!**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/thememarket`)
6. Create a `.env` file in `backend-simple` folder:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thememarket
   ```

### Option 2: Local MongoDB (Windows)
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run automatically on `mongodb://localhost:27017`
4. No `.env` file needed (uses default connection string)

### Option 3: Use Supabase (Alternative)
If you prefer PostgreSQL over MongoDB, I can create a Supabase version instead.

---

## 🔧 Installation Steps

### 1. Install Dependencies
```bash
cd backend-simple
npm install
```

### 2. Setup MongoDB (Choose one option above)

### 3. Start the Server
```bash
npm start
```

Or for development (auto-restart on changes):
```bash
npm run dev
```

### 4. Verify Server is Running
You should see:
```
🚀 Server running on http://localhost:3001
📡 API available at http://localhost:3001/api
🗄️  Database: MongoDB

📝 Default Admin Login:
   Email: admin@thememarket.com
   Password: admin123

✅ MongoDB Connected Successfully
✅ Default admin created: admin@thememarket.com / admin123
```

---

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@thememarket.com`
- Password: `admin123`

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user/me` - Get current user (requires auth)

### Themes
- `GET /api/themes` - Get all published themes
- `GET /api/themes/:id` - Get single theme
- `POST /api/themes/upload` - Upload theme (Admin only)
- `DELETE /api/themes/:id` - Delete theme (Admin only)

### Downloads
- `POST /api/themes/download/:id` - Download theme (requires auth)
- `GET /api/user/downloads` - Get user downloads (requires auth)

### Orders
- `POST /api/orders` - Create order/purchase theme (requires auth)
- `GET /api/user/orders` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (requires auth)

### Health Check
- `GET /api/health` - Check if server is running

---

## 🗄️ Database Collections

The backend automatically creates these MongoDB collections:

1. **users** - User accounts
   - name, email, password (hashed), role, createdAt

2. **themes** - Theme products
   - title, description, price, category, preview_image, download_count, etc.

3. **orders** - Purchase records
   - user_id, theme_id, amount, status, order_date

4. **downloads** - Download tracking
   - user_id, theme_id, theme_title, download_date

---

## 🧪 Testing the Backend

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### 3. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thememarket.com","password":"admin123"}'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error: MongooseServerSelectionError
```
**Solution:** 
- Check if MongoDB is running
- Verify connection string in `.env` file
- For MongoDB Atlas, check IP whitelist (add 0.0.0.0/0 for development)

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or use different port
set PORT=3002
npm start
```

### Module Not Found
```
Error: Cannot find module 'mongoose'
```
**Solution:**
```bash
npm install
```

---

## 📝 Environment Variables

Create a `.env` file in `backend-simple` folder:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/thememarket

# JWT Secret (for session tokens)
JWT_SECRET=thememarket-secret-key-2024

# Server Port
PORT=3001
```

---

## 🎯 Next Steps

1. ✅ Backend is running with MongoDB
2. ✅ Authentication works (login/register)
3. ✅ Theme CRUD operations work
4. ✅ Purchase and download functionality works
5. ✅ Dashboard shows real-time data from database
6. ✅ Frontend connected to backend (no localStorage)

---

## 💡 Features

- ✅ **No localStorage** - All data in MongoDB
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-based Access** - User and Admin roles
- ✅ **Real-time Dashboard** - Live data from database
- ✅ **Purchase Tracking** - Complete order management
- ✅ **Download Tracking** - Monitor theme downloads
- ✅ **Admin Controls** - Upload/delete themes

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message in terminal
2. Verify MongoDB is running
3. Ensure all dependencies are installed (`npm install`)
4. Check `.env` file configuration
