#!/bin/bash

echo "========================================"
echo " ThemeMarket - Quick Setup Script"
echo "========================================"
echo ""
echo "This script will check for required dependencies"
echo "and guide you through installation if needed."
echo ""

# ============================================
# CHECK 1: Node.js
# ============================================
echo "[CHECK 1/3] Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo ""
    echo "[!] Node.js is NOT installed"
    echo ""
    echo "Node.js is REQUIRED to run the backend server."
    echo ""
    echo "Please install Node.js using one of these methods:"
    echo ""
    echo "METHOD 1: Using package manager (RECOMMENDED)"
    echo "  macOS: brew install node"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  Fedora: sudo dnf install nodejs npm"
    echo "  Arch: sudo pacman -S nodejs npm"
    echo ""
    echo "METHOD 2: Download from website"
    echo "  https://nodejs.org/"
    echo "  Recommended: Download the LTS version"
    echo ""
    echo "After installation:"
    echo "1. Close this terminal"
    echo "2. Open a NEW terminal"
    echo "3. Run: chmod +x setup.sh"
    echo "4. Run: ./setup.sh"
    echo ""
    read -p "Press Enter to open the Node.js download page..."
    open https://nodejs.org/ 2>/dev/null || xdg-open https://nodejs.org/ 2>/dev/null
    exit 1
else
    NODE_VERSION=$(node --version)
    echo "[OK] Node.js is installed: $NODE_VERSION"
fi
echo ""

# ============================================
# CHECK 2: npm
# ============================================
echo "[CHECK 2/3] Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo ""
    echo "[!] npm is NOT installed"
    echo ""
    echo "npm comes with Node.js. If you installed Node.js,"
    echo "please restart your terminal and try again."
    echo ""
    echo "If you don't have Node.js, install it using:"
    echo "  macOS: brew install node"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo ""
    read -p "Press Enter to continue..."
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo "[OK] npm is installed: $NPM_VERSION"
fi
echo ""

# ============================================
# CHECK 3: Python or alternative
# ============================================
echo "[CHECK 3/3] Checking for Python..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo ""
    echo "[!] Python is NOT installed"
    echo ""
    echo "Python is used to run the frontend server."
    echo ""
    echo "You have TWO options:"
    echo ""
    echo "OPTION 1: Install Python (RECOMMENDED)"
    echo "  macOS: brew install python3"
    echo "  Ubuntu/Debian: sudo apt install python3"
    echo "  Fedora: sudo dnf install python3"
    echo ""
    echo "OPTION 2: Use Node.js to serve frontend"
    echo "  The script will use: npx http-server -p 8080"
    echo "  (This requires Node.js which you already have)"
    echo ""
    echo "What would you like to do?"
    echo ""
    echo "1. Continue without Python (will use Node.js for frontend)"
    echo "2. Cancel setup and install Python manually"
    echo ""
    read -p "Enter your choice (1/2): " PYTHON_CHOICE
    
    if [ "$PYTHON_CHOICE" = "2" ]; then
        echo ""
        echo "Setup cancelled."
        exit 1
    else
        echo ""
        echo "[OK] Will use Node.js http-server for frontend"
        USE_NODE_FRONTEND=1
    fi
else
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        PYTHON_CMD="python3"
    else
        PYTHON_VERSION=$(python --version)
        PYTHON_CMD="python"
    fi
    echo "[OK] Python is installed: $PYTHON_VERSION"
    USE_NODE_FRONTEND=0
fi
echo ""

# ============================================
# INSTALL BACKEND DEPENDENCIES
# ============================================
echo "========================================"
echo " Installing Backend Dependencies"
echo "========================================"
echo ""

cd backend-simple
if [ ! -d "node_modules" ]; then
    echo "[1/2] Installing npm packages (this may take a few minutes)..."
    echo ""
else
    echo "[1/2] Backend dependencies already installed"
    echo "       Skipping npm install..."
    echo ""
fi

npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to install backend dependencies!"
    echo ""
    echo "This could be due to:"
    echo "- No internet connection"
    echo "- npm is not properly installed"
    echo ""
    echo "Try these steps:"
    echo "1. Check your internet connection"
    echo "2. Run: npm cache clean --force"
    echo "3. Run ./setup.sh again"
    echo ""
    exit 1
fi
echo "[OK] Backend dependencies installed successfully"
echo ""

# ============================================
# INSTALL NODE HTTP-SERVER (if needed)
# ============================================
if [ "$USE_NODE_FRONTEND" = "1" ]; then
    echo "[2/3] Installing Node.js http-server for frontend..."
    echo ""
    cd ..
    npm install -g http-server
    if [ $? -ne 0 ]; then
        echo ""
        echo "[WARNING] Failed to install http-server globally"
        echo "Will use npx instead (downloads each time)..."
        echo ""
        USE_NPX=1
    else
        echo "[OK] http-server installed"
        USE_NPX=0
    fi
    echo ""
else
    echo "[2/3] Preparing frontend server..."
    echo ""
fi

# ============================================
# START SERVERS
# ============================================
echo "========================================"
echo " Starting ThemeMarket Servers"
echo "========================================"
echo ""

cd ../backend-simple
echo "[3/4] Starting backend server..."
npm start &
BACKEND_PID=$!
sleep 3
echo "[OK] Backend server started on http://localhost:3001"
echo ""

cd ../frontend
if [ "$USE_NODE_FRONTEND" = "1" ]; then
    echo "[4/4] Starting frontend server (Node.js)..."
    if [ "$USE_NPX" = "1" ]; then
        npx http-server -p 8080 &
    else
        http-server -p 8080 &
    fi
else
    echo "[4/4] Starting frontend server (Python)..."
    $PYTHON_CMD -m http.server 8080 &
fi
FRONTEND_PID=$!
echo "[OK] Frontend server started on http://localhost:8080"
echo ""

# ============================================
# SUCCESS
# ============================================
echo "========================================"
echo " Setup Complete!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:8080"
echo ""
echo "Opening homepage in your browser..."
echo ""
sleep 2
open http://localhost:8080/index.html 2>/dev/null || xdg-open http://localhost:8080/index.html 2>/dev/null

echo ""
echo "========================================"
echo " Need Help?"
echo "========================================"
echo ""
echo "If the website doesn't load:"
echo "1. Wait 5-10 seconds for servers to start"
echo "2. Refresh the browser"
echo "3. Check terminal output for errors"
echo "4. Read the README.md for troubleshooting"
echo ""
echo "To stop the servers:"
echo "  Press Ctrl+C in this terminal"
echo ""

# Wait for user to press Ctrl+C
echo "Press Ctrl+C to stop all servers"
wait
