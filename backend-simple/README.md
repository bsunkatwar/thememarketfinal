# 🚀 Simple Backend for ThemeMarket

**No database required!** This backend uses JSON file storage - the easiest way to run a backend.

## ✨ Features

- ✅ **Zero Database Setup** - Uses simple JSON files
- ✅ **No MySQL Required** - No complex configuration
- ✅ **Easy to Understand** - All data in one file
- ✅ **Persistent Storage** - Data saved to `data.json`
- ✅ **Full API Support** - Auth, Themes, Downloads

## 📦 Quick Start

### 1. Install Dependencies
```bash
cd backend-simple
npm install
```

### 2. Start Server
```bash
npm start
```

That's it! Server runs on `http://localhost:3000`

## 🔑 Default Admin Login

- **Email**: `admin@thememarket.com`
- **Password**: `admin123`

## 📁 File Structure

```
backend-simple/
├── server.js          # Main server file (all code in one file!)
├── data.json          # Database (JSON file)
├── package.json       # Dependencies
└── README.md          # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user/me` - Get current user (requires auth)

### Themes
- `GET /api/themes` - Get all themes
- `GET /api/themes/:id` - Get single theme

### Downloads
- `POST /api/themes/download/:id` - Download theme (requires auth)
- `GET /api/user/downloads` - Get user downloads (requires auth)

### Health Check
- `GET /api/health` - Check if server is running

## 💾 Data Storage

All data is stored in `data.json`:
- **users** - User accounts
- **themes** - Theme listings
- **downloads** - Download history
- **orders** - Order history

You can manually edit `data.json` to add/modify data!

## 🛠 Technologies

- **Express.js** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **cors** - Cross-origin support
- **fs (File System)** - Data storage

## 📝 Example: Add a New Theme

Just edit `data.json` and add to the themes array:

```json
{
  "id": 4,
  "title": "My New Theme",
  "description": "Awesome theme",
  "price": 49,
  "category": "Business",
  "preview_image": "theme.jpeg",
  "download_count": 0,
  "is_published": true,
  "createdAt": "2026-04-24T00:00:00.000Z"
}
```

Restart the server and it's live!

## 🎯 Why This is Better for Development

1. **No MySQL installation needed**
2. **No database configuration**
3. **No connection strings**
4. **No SQL queries**
5. **Easy to backup** (just copy data.json)
6. **Easy to reset** (delete data.json and restart)
7. **Perfect for learning**

## 🔄 Reset Data

Want to start fresh? Just delete `data.json` and restart the server. It will create a new one!

---

**That's how simple it is! 🎉**
