@echo off
title Shri Janani Hospital Software
color 0A

echo ========================================================
echo          SHRI JANANI HOSPITAL SOFTWARE LAUNCHER
echo ========================================================
echo.
echo Starting Express Backend API & MySQL Connection...
start "Janani Hospital Backend Server" /min cmd /c "npm run server"

timeout /t 2 /nobreak >nul

echo Starting Hospital Software Web Application...
start "Janani Hospital Web App" /min cmd /c "npm run dev"

timeout /t 3 /nobreak >nul

echo Opening Shri Janani Hospital Software in Web Browser...
start http://localhost:5173

echo.
echo ========================================================
echo  Hospital Software is running! Keep this window open.
echo ========================================================
echo.
