# Fix for "Failed to download remote update" Error

If you're encountering the error "Uncaught Error: java.io.IOException: Failed to download remote update" in Expo Go, follow these steps to resolve it:

## Quick Solution

I've modified the app.json file to disable updates that were causing the error. Follow these steps to apply the fix:

1. Stop any running Expo processes
2. Run the app with clean cache using:
   ```
   npx expo start -c
   ```
3. Connect your Expo Go app again

## How the Fix Works

The error occurs because Expo is trying to download updates from a remote server but can't access it properly. The solution:

1. We've disabled the update system in app.json:
   ```json
   "updates": {
     "enabled": false,
     "fallbackToCacheTimeout": 0,
     "checkAutomatically": "ON_ERROR_RECOVERY"
   }
   ```

2. This forces the app to use the local development bundle instead of trying to fetch remote updates.

## Development Mode Instructions

For the best development experience:

1. Make sure your device is on the same network as your computer
2. Start the Expo development server with:
   ```
   npx expo start --tunnel
   ```
   Using the tunnel option helps bypass network restrictions.

3. Scan the QR code with your phone's camera (iOS) or directly from the Expo Go app (Android)

4. If you still experience issues, check your firewall settings and make sure port 19000 and 19001 are not blocked.

## Troubleshooting

If you still encounter issues:

1. Clear the Expo cache using the provided script:
   ```
   .\clear-expo-cache.bat
   ```

2. Make sure you have the latest version of Expo Go installed on your device

3. Try development mode with different connection options:
   ```
   # LAN mode
   npx expo start --lan -c
   
   # Tunnel mode
   npx expo start --tunnel -c
   ```

4. Check your Android/iOS device for any permission issues or network restrictions 