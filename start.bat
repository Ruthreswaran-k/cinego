@echo off
title CineGo Full-Stack Launcher
echo ========================================================
echo         CineGo Cinema Booking System - Starting
echo ========================================================
echo.
echo [1/2] Launching Backend Server on http://localhost:3000...
start "CineGo Backend (Port 3000)" cmd /k "cd /d %~dp0backend && npm run dev"

echo [2/2] Launching Frontend Client on http://localhost:5173...
start "CineGo Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo --------------------------------------------------------
echo Both servers are starting up in separate windows.
echo Opening CineGo in your browser...
echo --------------------------------------------------------
timeout /t 3 >nul
start http://localhost:5173
