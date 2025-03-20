#!/bin/bash
echo "Clearing Expo cache and restarting development server..."

# Kill any running Metro processes
pkill -f "node.*[metro]" || true

# Clear watchman watches (if watchman is installed)
command -v watchman >/dev/null 2>&1 && watchman watch-del-all || true

# Clear Expo and Metro caches
rm -rf ~/.expo
rm -rf ~/Library/Caches/Expo
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
rm -rf node_modules/.cache

# Remove node_modules folder and reinstall
echo "Removing node_modules folder..."
rm -rf node_modules
echo "Installing dependencies..."
npm install

# Start Expo server with clear cache
echo "Starting Expo development server with cleared cache..."
npx expo start -c

echo "Done!" 