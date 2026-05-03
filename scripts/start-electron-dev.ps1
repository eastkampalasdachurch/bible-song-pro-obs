# Start Electron Dev
bun run build
bun run build:electron

# Start Next.js dev server in background
Start-Process -FilePath "bun" -ArgumentList "run dev" -NoNewWindow

# Wait for server
Start-Sleep -Seconds 6

# Start Electron 
Start-Process -FilePath "npx" -ArgumentList "electron ." -NoNewWindow