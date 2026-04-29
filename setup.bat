@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  ThemeMarket - Quick Setup Script
echo ========================================
echo.
echo This script will check for required dependencies
echo and guide you through installation if needed.
echo.

:: ============================================
:: CHECK 1: Node.js
:: ============================================
echo [CHECK 1/3] Checking for Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [!] Node.js is NOT installed
    echo.
    echo Node.js is REQUIRED to run the backend server.
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo Recommended: Download the LTS (Long Term Support) version
    echo.
    echo After installation:
    echo 1. Close this window
    echo 2. Open a NEW command prompt
    echo 3. Run setup.bat again
    echo.
    echo Press any key to open the Node.js download page...
    pause > nul
    start https://nodejs.org/
    exit /b 1
) else (
    for /f "delims=" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js is installed: !NODE_VERSION!
)
echo.

:: ============================================
:: CHECK 2: npm
:: ============================================
echo [CHECK 2/3] Checking for npm...
where npm >nul 2>nul
if errorlevel 1 (
    echo.
    echo [!] npm is NOT installed
    echo.
    echo npm comes with Node.js. If you installed Node.js,
    echo please restart your computer and try again.
    echo.
    echo If you don't have Node.js, download it from:
    echo https://nodejs.org/
    echo.
    echo Press any key to open the Node.js download page...
    pause > nul
    start https://nodejs.org/
    exit /b 1
) else (
    for /f "delims=" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm is installed: !NPM_VERSION!
)
echo.

:: ============================================
:: CHECK 3: Python
:: ============================================
echo [CHECK 3/3] Checking for Python...
where python >nul 2>nul
if errorlevel 1 (
    echo.
    echo [!] Python is NOT installed
    echo.
    echo Python is REQUIRED to run the frontend server.
    echo.
    echo You have TWO options:
    echo.
    echo OPTION 1: Install Python (RECOMMENDED)
    echo Download from: https://www.python.org/downloads/
    echo IMPORTANT: Check "Add Python to PATH" during installation!
    echo.
    echo OPTION 2: Use Node.js to serve frontend instead
    echo If you don't want to install Python, you can use:
    echo   npx http-server -p 8080
    echo (This requires Node.js which you already have)
    echo.
    echo What would you like to do?
    echo.
    echo 1. Open Python download page
    echo 2. Continue without Python (will use Node.js for frontend)
    echo 3. Cancel setup
    echo.
    set /p PYTHON_CHOICE=Enter your choice (1/2/3): 
    
    if "!PYTHON_CHOICE!"=="1" (
        start https://www.python.org/downloads/
        echo.
        echo After installing Python:
        echo 1. Close this window
        echo 2. Open a NEW command prompt
        echo 3. Run setup.bat again
        echo.
        pause
        exit /b 1
    ) else if "!PYTHON_CHOICE!"=="2" (
        echo.
        echo [OK] Will use Node.js http-server for frontend
        set USE_NODE_FRONTEND=1
    ) else (
        echo.
        echo Setup cancelled.
        pause
        exit /b 1
    )
) else (
    for /f "delims=" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo [OK] Python is installed: !PYTHON_VERSION!
    set USE_NODE_FRONTEND=0
)
echo.

:: ============================================
:: INSTALL BACKEND DEPENDENCIES
:: ============================================
echo ============================================
echo  Installing Backend Dependencies
echo ============================================
echo.

cd backend-simple
if not exist "node_modules" (
    echo [1/2] Installing npm packages (this may take a few minutes)...
    echo.
) else (
    echo [1/2] Backend dependencies already installed
    echo       Skipping npm install...
    echo.
)

call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install backend dependencies!
    echo.
    echo This could be due to:
    echo - No internet connection
    echo - npm is not properly installed
    echo - Antivirus blocking npm
    echo.
    echo Try these steps:
    echo 1. Check your internet connection
    echo 2. Run: npm cache clean --force
    echo 3. Run setup.bat again
    echo.
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed successfully
echo.

:: ============================================
:: INSTALL NODE HTTP-SERVER (if needed)
:: ============================================
if "!USE_NODE_FRONTEND!"=="1" (
    echo [2/3] Installing Node.js http-server for frontend...
    echo.
    cd ..
    call npm install -g http-server
    if errorlevel 1 (
        echo.
        echo [WARNING] Failed to install http-server globally
        echo Will try to use npx instead...
        echo.
        set USE_NPX=1
    ) else (
        echo [OK] http-server installed
        set USE_NPX=0
    )
    echo.
) else (
    echo [2/3] Preparing frontend server...
    echo.
)

:: ============================================
:: START SERVERS
:: ============================================
echo ============================================
echo  Starting ThemeMarket Servers
echo ============================================
echo.

cd ..\backend-simple
echo [3/4] Starting backend server...
start "ThemeMarket Backend" cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo [OK] Backend server started on http://localhost:3001
echo.

cd ..\frontend
if "!USE_NODE_FRONTEND!"=="1" (
    echo [4/4] Starting frontend server (Node.js)...
    if "!USE_NPX!"=="1" (
        start "ThemeMarket Frontend" cmd /k "npx http-server -p 8080"
    ) else (
        start "ThemeMarket Frontend" cmd /k "http-server -p 8080"
    )
) else (
    echo [4/4] Starting frontend server (Python)...
    start "ThemeMarket Frontend" cmd /k "python -m http.server 8080"
)
echo [OK] Frontend server started on http://localhost:8080
echo.

:: ============================================
:: SUCCESS
:: ============================================
echo ============================================
echo  Setup Complete!
echo ============================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:8080
echo.
echo Opening homepage in your browser...
echo.
timeout /t 2 /nobreak > nul
start http://localhost:8080/index.html

echo.
echo ============================================
echo  Need Help?
echo ============================================
echo.
echo If the website doesn't load:
echo 1. Wait 5-10 seconds for servers to start
echo 2. Refresh the browser (F5)
echo 3. Check both server windows for errors
echo 4. Read the README.md for troubleshooting
echo.
echo To stop the servers:
echo - Close the "ThemeMarket Backend" window
echo - Close the "ThemeMarket Frontend" window
echo.
echo Press any key to exit this window...
pause > nul
