@echo off
echo ===================================================
echo Resetting MySQL root password to: Ranjith@2660
echo ===================================================

net stop MySQL80

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --init-file="%~dp0reset.sql" --console

net start MySQL80

echo.
echo ===================================================
echo SUCCESS! MySQL root password reset to: Ranjith@2660
echo ===================================================
pause
