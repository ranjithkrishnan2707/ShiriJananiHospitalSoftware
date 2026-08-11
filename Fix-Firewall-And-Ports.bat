@echo off
title Janani Hospital Software - Windows Firewall Repair
color 0C

echo ========================================================
echo   SHRI JANANI HOSPITAL - WINDOWS FIREWALL REPAIR TOOL
echo ========================================================
echo.
echo Allowing inbound connections on Port 5000 (API) and Port 5173 (App)...
echo.

netsh advfirewall firewall delete rule name="Janani Hospital Ports" >nul 2>&1
netsh advfirewall firewall add rule name="Janani Hospital Ports" dir=in action=allow protocol=TCP localport=5000,5173

echo.
echo ========================================================
echo  ✅ FIREWALL RULE ADDED SUCCESSFULLY!
echo  Ports 5000 and 5173 are now open for LAN client PCs.
echo ========================================================
echo.
pause
