@echo off
echo ========================================
echo   ThemeMarket Backend Setup
echo ========================================
echo.

cd backend-simple

echo Step 1: Installing dependencies...
call npm install
echo.

if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    echo Please make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo Step 2: Checking for .env file...
if not exist .env (
    echo.
    echo WARNING: .env file not found!
    echo.
    echo Please create a .env file with your MongoDB Atlas connection string:
    echo.
    echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thememarket
    echo JWT_SECRET=thememarket-secret-key-2024
    echo PORT=3001
    echo.
    echo Follow the instructions in MONGODB_ATLAS_SETUP.md to get your connection string.
    echo.
    pause
    exit /b 1
)

echo .env file found!
echo.

echo Step 3: Starting the server...
echo.
echo ========================================
echo   Server Starting...
echo ========================================
echo.

call npm start

pause
