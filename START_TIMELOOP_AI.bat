@echo off
title TIMELOOP AI - 4D Multiverse Server
echo ========================================================
echo         TIMELOOP AI - 4D MULTIVERSE SERVER
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/3] Checking if server is already running on port 3000...
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %errorlevel% == 0 (
    echo [OK] Port 3000 is ALREADY ACTIVE and RUNNING!
) else (
    echo [STARTING] Launching Next.js Production Server...
    start "Timeloop AI Server" cmd /k "npm start"
    echo Waiting for server to initialize...
    timeout /t 3 /nobreak >nul
)

echo.
echo [2/3] Opening TIMELOOP AI in your browser...
start http://localhost:3000

echo.
echo ========================================================
echo [SUCCESS] TIMELOOP AI is running at:
echo    Main 4D Multiverse:   http://localhost:3000
echo    4D In-Person Arena:   http://localhost:3000/experience-4d
echo    3D Virtual World:     http://localhost:3000/virtual-world
echo ========================================================
echo.
echo You can keep this window open or minimize it.
pause
