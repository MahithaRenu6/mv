@echo off
echo Testing Bookings API...
echo.

REM First, login to get token
echo Step 1: Logging in...
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"mahi@gmail.com\",\"password\":\"123456\"}" ^
  -o login-response.json

echo.
echo Login response saved to login-response.json
echo.

REM Extract token (you'll need to manually copy it)
type login-response.json
echo.
echo.
echo Please copy the token from above and paste it below:
set /p TOKEN="Token: "

echo.
echo Step 2: Fetching bookings with token...
curl -X GET http://localhost:5000/api/bookings/my-bookings ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json"

echo.
echo.
pause
