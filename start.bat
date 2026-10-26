@echo off
title HABIBTI Server (KEEP OPEN)
cd /d "%~dp0"
cls
echo ==============================================================
echo   HABIBTI ALBUM COVER GENERATOR
echo   Running on: http://127.0.0.1:8888
echo.
echo   Keep this black window OPEN while using the app!
echo ==============================================================
echo.
echo Launching http://127.0.0.1:8888 in your browser...
start http://127.0.0.1:8888
echo.
npm.cmd run dev
pause
