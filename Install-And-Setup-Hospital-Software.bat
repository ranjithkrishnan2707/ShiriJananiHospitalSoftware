@echo off
title SHIRI JANANI HOSPITALS Software - Client Installer & Setup
color 0A

echo ========================================================
echo       SHIRI JANANI HOSPITALS SOFTWARE - CLIENT SETUP
echo ========================================================
echo.

set /p MYSQL_PASS="Enter Client's MySQL Root Password (press Enter if blank): "

echo.
echo 1. Writing configuration (.env)...
(
  echo PORT=5000
  echo DB_HOST=localhost
  echo DB_USER=root
  echo DB_PASSWORD=%MYSQL_PASS%
  echo DB_NAME=janani_hospital_db
  echo DB_PORT=3306
) > .env

echo.
echo 2. Installing application dependencies...
call npm install

echo.
echo 3. Building application production bundle...
call npm run build

echo.
echo 4. Creating Desktop Icon Shortcut on Client PC...
set SCRIPT="%TEMP%\create_hospital_shortcut.vbs"
set APP_PATH=%~dp0Start-Hospital-Desktop-App.bat
set DESKTOP_PATH=%USERPROFILE%\Desktop\SHIRI JANANI HOSPITALS.lnk

echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%DESKTOP_PATH%" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%APP_PATH%" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "SHIRI JANANI HOSPITALS Desktop Software" >> %SCRIPT%
echo oLink.IconLocation = "%~dp0public\desktop-icon.png" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo ========================================================
echo  🎉 INSTALLATION COMPLETE!
echo ========================================================
echo  A Desktop Icon "SHIRI JANANI HOSPITALS" has been created
echo  on your Windows Desktop!
echo.
echo  Double-click "SHIRI JANANI HOSPITALS" on your Desktop to run!
echo ========================================================
echo.
pause
