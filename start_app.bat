@echo off
echo Starting Patel Caterers App...

:: Start Backend
echo Starting Backend Server...
cd backend
start "Backend Server" /MIN cmd /k "node server.js"
cd ..

:: Start Frontend
echo Starting Frontend Server...
cd frontend
start "Frontend Server" /MIN cmd /k "npm run dev"

:: Wait a few seconds for servers to initialize
timeout /t 4 /nobreak >nul

:: Open the App in Default Browser
start http://localhost:5173

exit