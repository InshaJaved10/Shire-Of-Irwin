param (
    [Parameter(Mandatory=$true)]
    [string]$DestinationFolder
)

# Check if destination folder exists, create if not
if (-not (Test-Path -Path $DestinationFolder)) {
    Write-Host "Creating destination folder: $DestinationFolder"
    New-Item -ItemType Directory -Path $DestinationFolder -Force | Out-Null
}

# Get the current directory path
$SourceFolder = $PWD.Path
Write-Host "Source folder: $SourceFolder"
Write-Host "Destination folder: $DestinationFolder"

# Define folders to copy
$FoldersToCopy = @(
    "app", 
    "assets", 
    "components", 
    "constants", 
    "hooks", 
    "scripts"
)

# Define important files to copy
$FilesToCopy = @(
    "package.json", 
    "package-lock.json", 
    "tsconfig.json", 
    "babel.config.js", 
    "app.json", 
    "App.tsx",
    "App.js",
    "index.js",
    "metro.config.js",
    "eas.json",
    "README.md"
)

# Copy folders
foreach ($folder in $FoldersToCopy) {
    $source = Join-Path -Path $SourceFolder -ChildPath $folder
    $destination = Join-Path -Path $DestinationFolder -ChildPath $folder
    
    if (Test-Path -Path $source) {
        Write-Host "Copying folder: $folder"
        
        # Create destination folder if it doesn't exist
        if (-not (Test-Path -Path $destination)) {
            New-Item -ItemType Directory -Path $destination -Force | Out-Null
        }
        
        # Copy folder content
        Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force
    }
}

# Copy files
foreach ($file in $FilesToCopy) {
    $source = Join-Path -Path $SourceFolder -ChildPath $file
    $destination = Join-Path -Path $DestinationFolder -ChildPath $file
    
    if (Test-Path -Path $source) {
        Write-Host "Copying file: $file"
        Copy-Item -Path $source -Destination $destination -Force
    }
}

Write-Host "Project saved successfully to: $DestinationFolder" 