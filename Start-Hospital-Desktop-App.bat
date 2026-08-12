@echo off
title SHIRI JANANI HOSPITALS Desktop Software
color 0B

echo ========================================================
echo       SHIRI JANANI HOSPITALS - DESKTOP APPLICATION LAUNCHER
echo ========================================================
echo.
echo 1. Starting Express Backend Server & MySQL Connection...
start "Janani Hospital Backend" /min cmd /c "npm run server"

timeout /t 2 /nobreak >nul

echo 2. Starting Frontend Web Application Engine...
start "Janani Hospital Frontend" /min cmd /c "npm run dev"

timeout /t 3 /nobreak >nul

echo 3. Launching SHIRI JANANI HOSPITALS Desktop Window App...

:: Try launching in Chrome Standalone App Mode (No browser bars/tabs)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:5173 --window-size=1366,768 --user-data-dir="%LOCALAPPDATA%\JananiHospitalApp"
    goto END
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app=http://localhost:5173 --window-size=1366,768 --user-data-dir="%LOCALAPPDATA%\JananiHospitalApp"
    goto END
)

:: Try launching in MS Edge Standalone App Mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:5173 --window-size=1366,768 --user-data-dir="%LOCALAPPDATA%\JananiHospitalApp"
    goto END
)

:: Fallback to default browser
start http://localhost:5173

:END
echo.
echo ========================================================
echo  Hospital Desktop App is active! Keep this window minimized.
echo ========================================================
echo.
