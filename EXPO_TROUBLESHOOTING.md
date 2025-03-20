# Expo Go Troubleshooting Guide

If you're having trouble connecting your app to Expo Go on your mobile device, follow these steps to resolve the issues:

## Step 1: Clear Caches and Rebuild

Run the provided script to clear all caches and rebuild the project:

```bash
# On Windows:
.\clear-expo-cache.bat

# On Mac/Linux:
# First make the script executable:
chmod +x ./clear-expo-cache.sh
# Then run it:
./clear-expo-cache.sh
```

## Step 2: Verify Network Settings

1. Ensure your mobile device and development computer are on the same Wi-Fi network
2. Make sure no firewall is blocking the connection
3. Try using "Tunnel" connection type in Expo CLI: 
   ```
   npx expo start --tunnel
   ```

## Step 3: Manual Steps If Script Doesn't Work

If the script doesn't work, try these steps manually:

1. Stop any running Expo/Metro processes
2. Delete cache folders:
   ```
   # On Windows
   rmdir /s /q node_modules\.cache
   rmdir /s /q %APPDATA%\Expo
   rmdir /s /q %USERPROFILE%\.expo

   # On Mac/Linux
   rm -rf node_modules/.cache
   rm -rf ~/.expo
   ```

3. Reinstall dependencies:
   ```
   npm install
   ```

4. Start with a clean cache:
   ```
   npx expo start -c
   ```

## Step 4: Verify Expo Go Version

Make sure your Expo Go app is up to date. The current application is built with Expo SDK 50.

## Step 5: Try Developer Menu Options

In Expo Go, shake your device to open the developer menu, then:

1. Select "Reload"
2. Try "Fast Refresh"
3. Check "Debug Remote JS" if needed for troubleshooting

## Step 6: Use Specific Connection Mode

If everything else fails:

```bash
# Try explicit LAN mode
npx expo start --lan -c

# Or try explicit Tunnel mode if behind firewall/VPN
npx expo start --tunnel -c
```

## Step 7: Check Application Logs

Monitor the Metro bundler logs in your terminal for specific error messages that might point to configuration issues.

If you're still having issues after trying all these steps, please provide the error messages you see in the Expo Go app or in the terminal. 