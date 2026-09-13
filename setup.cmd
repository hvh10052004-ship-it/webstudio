@echo off
cd /d "%~dp0.."
echo Cai WebStudio app...
call npm install
if errorlevel 1 exit /b 1
call npm run setup
if errorlevel 1 exit /b 1
echo.
echo Chay: npm run dev
echo App: http://localhost:3000/app-khach
pause
