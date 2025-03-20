# Shire of Irwin Inspections App

A mobile application for managing property inspections for the Shire of Irwin.

## Project Structure Setup

This repository contains two scripts to help you set up the project structure on your local machine:

1. `setup_project_structure.ps1` - PowerShell script for Windows users
2. `setup_project_structure.bat` - Batch file for Windows users who prefer batch scripts

### Setting Up the Project Structure

#### Using PowerShell (Recommended for Windows 10/11)

1. Open PowerShell
2. Navigate to the directory where you want to create the project
3. Run the script:
   ```
   .\setup_project_structure.ps1
   ```

#### Using Batch File

1. Open Command Prompt
2. Navigate to the directory where you want to create the project
3. Run the script:
   ```
   setup_project_structure.bat
   ```

## Project Structure

The project follows this structure:

```
ShireOfIrwin/
├── app/
│   ├── (auth)/
│   │   ├── dashboard.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   ├── application-form.tsx
│   │   └── _layout.tsx
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── database.ts
│   │   ├── testConnection.ts
│   │   └── realtimeDb.ts
│   ├── components/
│   ├── config/
│   ├── types/
│   ├── index.tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
├── assets/
│   ├── images/
│   │   └── Logo.jpg
│   └── fonts/
├── components/
├── hooks/
├── constants/
├── scripts/
└── [other project files]
```

## Development Setup

After setting up the project structure:

1. Copy your source code files into the appropriate directories
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npx expo start
   ```

## Authentication

This project uses a simplified mock authentication system without relying on Firebase. The authentication flow is simulated locally.

## Features

- User authentication (sign in/sign up)
- Dashboard with inspection types
- Inspection scheduling and management
- Application form for new inspections

## License

[Your License Information]
