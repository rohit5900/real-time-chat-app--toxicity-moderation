---
description: How to start the Toxicity Chat Application (All Services)
---

You can start the entire application (AI Service, Chat Service, and Client) using the provided PowerShell script or by running each service individually.

### Option 1: One-Click Start (Recommended)

Run the PowerShell script from the root directory:

```powershell
.\start_dev.ps1
```

// turbo
This will open three separate terminal windows for each service.

### Option 2: Manual Start

If you prefer to run them manually, open three separate text terminals:

#### 1. AI Service (Python/FastAPI)

```bash
cd ai-service
# Activate venv if needed, then:
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Chat Service (Node.js)

```bash
cd chat-service
node server.js
```

#### 3. Client (React/Vite)

```bash
cd client
npm run dev
```

### Accessing the App

Once started, open your browser to:
[http://localhost:5173/](http://localhost:5173/)
