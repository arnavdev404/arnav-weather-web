@echo off
setlocal
cd /d "%~dp0"
title Arnav Weather Web Setup

echo ==============================================
echo          ARNAV WEATHER WEB SETUP
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required.
  echo Install Node.js and run this file again.
  pause
  exit /b 1
)

call npm config set registry https://registry.npmjs.org/
if exist node_modules rmdir /s /q node_modules
call npm install --registry=https://registry.npmjs.org/
if errorlevel 1 (
  echo npm install failed. Check your internet connection.
  pause
  exit /b 1
)

if not exist .env copy .env.example .env >nul
start "" notepad .env

echo.
echo Paste OPENWEATHER_API_KEY into .env and save it.
echo Then double-click START-WEBSITE.bat.
pause
