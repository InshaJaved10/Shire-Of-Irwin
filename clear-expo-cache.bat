@echo off
echo Clearing Expo cache and restarting development server...

:: Kill any running Metro processes
taskkill /f /im node.exe

:: Clear watchman watches (if watchman is installed)
watchman watch-del-all 2>NUL

:: Clear Expo cache
rmdir /s /q "%APPDATA%\Expo" 2>NUL
rmdir /s /q "%USERPROFILE%\.expo" 2>NUL
rmdir /s /q "%TEMP%\metro-cache" 2>NUL
rmdir /s /q "%TEMP%\haste-map-*" 2>NUL
rmdir /s /q "node_modules\.cache" 2>NUL

:: Remove node_modules folder and reinstall
echo Removing node_modules folder...
rmdir /s /q node_modules
echo Installing dependencies...
npm install

:: Start Expo server with clear cache
echo Starting Expo development server with cleared cache...
npx expo start -c

echo Done! 