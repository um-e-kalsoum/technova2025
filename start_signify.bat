@echo off
echo Starting Signify - Sign Language Recognition System
echo.

echo Installing Python dependencies...
pip install -r requirements-api.txt

echo.
echo Starting Flask API server...
start /B python app.py

echo.
echo Waiting for API to start...
timeout /t 3 /nobreak > nul

echo.
echo Frontend is already running on http://localhost:5173
echo Backend API is starting on http://localhost:5000
echo.
echo Visit http://localhost:5173 to use Signify!
echo.
echo Press any key to stop the servers...
pause > nul

echo.
echo Stopping servers...
taskkill /f /im python.exe 2>nul
echo Done!
