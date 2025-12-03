# Real-Time Chat Application with AI-Based Toxicity Moderation

A real-time chat application that uses an AI microservice to moderate messages for toxicity.

## Architecture

- **Chat Service**: Node.js + Socket.io (Port 3000)
- **AI Service**: Python + FastAPI + Detoxify (Port 8000)
- **Client**: React + Vite (Port 5173)
- **Database**: MongoDB (or In-Memory fallback)

## Prerequisites

- Node.js
- Python 3.8+
- MongoDB (Optional, defaults to in-memory if not found)

## Setup

1. **Install Chat Service Dependencies**

   ```bash
   cd chat-service
   npm install
   ```

2. **Install AI Service Dependencies**

   ```bash
   cd ai-service
   python -m pip install -r requirements.txt
   ```

   _Note: This installs PyTorch and Detoxify models, which may take some time._

3. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

## Running the Application

You can start all services using the provided PowerShell script:

```powershell
.\start_dev.ps1
```

Or run them individually:

1. **AI Service**

   ```bash
   cd ai-service
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Chat Service**

   ```bash
   cd chat-service
   node server.js
   ```

3. **Client**
   ```bash
   cd client
   npm run dev
   ```

## Features

- Real-time messaging
- Automatic toxicity detection
- Message status: Pending -> Allowed/Flagged/Blocked
- Glassmorphism UI
