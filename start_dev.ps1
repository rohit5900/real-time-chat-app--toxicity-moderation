# Start AI Service
Start-Process -FilePath ".\ai-service\venv\Scripts\python.exe" -ArgumentList "-m uvicorn main:app --host 0.0.0.0 --port 8000 --reload" -WorkingDirectory "ai-service" -WindowStyle Normal

# Start Chat Service
Start-Process -FilePath "node.exe" -ArgumentList "server.js" -WorkingDirectory "chat-service" -WindowStyle Normal

# Start Client
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "client" -WindowStyle Normal

Write-Host "Services started in separate windows."
