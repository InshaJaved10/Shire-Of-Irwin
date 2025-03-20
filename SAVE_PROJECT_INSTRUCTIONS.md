# Save Project Instructions

This folder contains scripts to save your project files and directories to a different location on your laptop.

## How to Use

### Using Batch File (Recommended for Windows)

1. Double-click on `save_project.bat`
2. Enter the destination folder path when prompted
   - Example: `C:\Users\YourUsername\Documents\MyProjects\ShireOfIrwin`
3. The script will copy all important project files and directories to the specified location

### Using PowerShell Script Directly

If you prefer using PowerShell:

1. Open PowerShell
2. Navigate to your project directory
3. Run the following command:
   ```powershell
   .\save_project.ps1 -DestinationFolder "C:\Path\To\Destination\Folder"
   ```

## What Gets Copied

The scripts will copy:

### Directories
- app/
- assets/
- components/
- constants/
- hooks/
- scripts/

### Important Files
- package.json
- package-lock.json
- tsconfig.json
- babel.config.js
- app.json
- App.tsx
- App.js
- index.js
- metro.config.js
- eas.json
- README.md

## Note

These scripts only copy the files; they don't delete anything from your original project location. If you want to modify which files/folders are copied, you can edit the `save_project.ps1` script. 