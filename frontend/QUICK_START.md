# 🚀 ThemeMarket - Quick Start Guide

## ⚡ Running the Project (5 minutes)

### Option 1: Frontend Only (No Backend)
**Perfect for browsing themes and testing UI**

1. **Using Python (if installed):**
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   Then open: http://localhost:8080

2. **Using Node.js:**
   ```bash
   cd frontend
   npx http-server -p 8080
   ```
   Then open: http://localhost:8080

3. **Using VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click `frontend/index.html`
   - Select "Open with Live Server"

**Note:** Without the backend, you can browse themes and view product pages, but login/register features won't work.

---

### Option 2: Full Stack (Frontend + Backend)
**Complete functionality with database**

#### Step 1: Setup Backend

```bash
cd backend-simple
npm install
```

Create a `.env` file in `backend-simple` folder:
```env
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=thememarket-secret-key-2024
PORT=3005
```

**For testing without database setup**, you can use a free Supabase database:
1. Go to https://supabase.com
2. Create a free project
3. Get your database connection string
4. Add it to `.env`

Start the backend:
```bash
npm start
```

Backend will run at: http://localhost:3005

#### Step 2: Setup Frontend

```bash
cd frontend
npx http-server -p 8080 --cors
```

Frontend will run at: http://localhost:8080

---

## 🌐 Accessing from Other Devices

To access from other devices on the same network:

1. **Find your IP address:**
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. **Access from other devices:**
   - Frontend: `http://YOUR_IP:8080`
   - Backend API: `http://YOUR_IP:3005/api`

**Important:** The frontend automatically detects the hostname and connects to the correct backend URL.

---

## 📁 Project Structure

```
ThemeMarket_final/
├── backend-simple/           # Node.js + Express Backend
│   ├── server-supabase.js   # Main server file
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables (create this)
│
├── frontend/                # HTML/CSS/JS Frontend
│   ├── index.html          # Homepage
│   ├── product.html        # Product details page
│   ├── category.html       # Category listing
│   ├── cart.html           # Shopping cart
│   └── assets/
│       ├── js/
│       │   ├── api.js           # API client (auto-detects server URL)
│       │   ├── themesData.js    # Theme data (works offline)
│       │   ├── productData.js   # Product details (works offline)
│       │   └── script.js        # Main frontend logic
│       └── css/
│           └── styles.css
│
└── README.md               # This file
```

---

## 🔐 Default Login Credentials

**Admin Account:**
- Email: `admin@thememarket.com`
- Password: `admin123`

---

## 🐛 Troubleshooting

### Product Page Shows "Theme Not Found"
**Cause:** Backend not running or product ID doesn't exist

**Solution:**
1. The frontend has fallback data for 8 products (IDs 1-8)
2. Products work WITHOUT backend for basic viewing
3. If you see this error, check browser console for details

### CORS Errors
**Cause:** Opening files directly with `file://` protocol

**Solution:** Always use a local server (http-server, Live Server, etc.)
```bash
cd frontend
npx http-server -p 8080 --cors
```

### Products Not Loading on Other Devices
**Cause:** Hardcoded `localhost` in API URL

**Solution:** Already fixed! The API URL in `api.js` auto-detects the hostname:
- Uses `localhost` when accessing from your machine
- Uses actual IP when accessing from other devices

### Backend Connection Errors
**Cause:** Database not configured or server not running

**Solution:**
1. Check if backend is running: http://localhost:3005/api/health
2. Verify `.env` file exists in `backend-simple` folder
3. Check database connection string is correct

---

## 📝 Features

### Working WITHOUT Backend:
✅ Browse all themes on homepage
✅ View product details (8 products included)
✅ Category filtering
✅ Add to cart
✅ View cart

### Working WITH Backend:
✅ User registration and login
✅ Purchase themes
✅ Download purchased themes
✅ Order history
✅ User dashboard
✅ Admin panel
✅ Real-time statistics

---

## 🔧 Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Bootstrap 5
- FontAwesome & Bootstrap Icons

**Backend:**
- Node.js + Express
- PostgreSQL (via Supabase)
- JWT Authentication
- bcrypt for password hashing

---

## 💡 Important Notes

1. **Always use a local server** - Don't open HTML files directly
2. **Product data is embedded** - 8 products work without backend
3. **API URL is dynamic** - Works on any device automatically
4. **Backend is optional** - Frontend works standalone for browsing

---

## 📞 Need Help?

Check browser console (F12) for error messages. Common issues:
- CORS errors → Use a local server
- Network errors → Check if backend is running
- "Theme not found" → Product ID might not exist (1-8 are available)

---

**Happy Theming! 🎨**
