@echo off
setlocal enabledelayedexpansion

echo Save Project to Laptop Folder
echo ============================
echo.

set /p DEST_FOLDER=Enter destination folder path: 

if not exist "%DEST_FOLDER%" (
    echo Creating destination folder: %DEST_FOLDER%
    mkdir "%DEST_FOLDER%"
)

echo.
echo Running PowerShell script to save project...
powershell -ExecutionPolicy Bypass -File "%~dp0save_project.ps1" -DestinationFolder "%DEST_FOLDER%"

echo.
echo Project saved successfully!
echo.
pause 