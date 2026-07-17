@echo off
setlocal
cd /d "%~dp0"
title Arnav Weather Web

echo ==============================================
echo             ARNAV WEATHER WEB
echo        http://localhost:5055
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required.
  pause
  exit /b 1
)

if not exist package.json (
  echo package.json was not found in this folder.
  echo Open the folder that directly contains package.json.
  pause
  exit /b 1
)

if not exist .env (
  copy .env.example .env >nul
  echo A new .env file was created.
  echo Paste your OpenWeather API key, save it, then run this file again.
  start "" notepad .env
  pause
  exit /b 1
)

if not exist node_modules (
  call npm config set registry https://registry.npmjs.org/
  call npm install --registry=https://registry.npmjs.org/
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5055'"
echo Starting the website. Keep this window open.
echo.
call npm start
pause
