# CivicSeva Voice Service (Local Hinglish Speech-to-Text)

Lightweight, private, and local Hinglish speech-to-text service powered by **FastAPI** and **faster-whisper**.

- **Model:** [`abhishekgautamm/whisper-tiny-hinglish-v2`](https://huggingface.co/abhishekgautamm/whisper-tiny-hinglish-v2)
- **Format:** CTranslate2 int8 (`ct2/int8`) for fast, efficient CPU inference
- **Output:** Romanized Hinglish transcription (e.g. *"mere area mein road bahut kharab hai"*)

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Python 3.9+
- Audio recording capability in modern web browsers

### 2. Install Dependencies
```bash
cd voice-service
pip install -r requirements.txt
```
Or directly:
```bash
pip install fastapi uvicorn faster-whisper python-multipart huggingface-hub
```

---

## 🏃 Running the Service

Start the FastAPI server:
```bash
python main.py
```
Or via Uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at `http://localhost:8000`.

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint:** `GET /health` or `GET /`
- **Response:**
  ```json
  {
    "status": "healthy",
    "service": "CivicSeva Hinglish Voice Service",
    "model": "abhishekgautamm/whisper-tiny-hinglish-v2",
    "device": "cpu",
    "compute_type": "int8"
  }
  ```

### 2. Transcribe Audio
- **Endpoint:** `POST /transcribe`
- **Payload:** `multipart/form-data` with field `file` (audio in WebM, WAV, MP3, OGG, or M4A)
- **Response:**
  ```json
  {
    "success": true,
    "text": "mere area mein road bahut kharab hai"
  }
  ```

---

## 🔄 Integration with CivicSeva

1. The frontend records citizen speech in the browser via `MediaRecorder` using browser-supported formats (`audio/webm;codecs=opus`, with fallbacks to `audio/mp4`, `audio/ogg`, or `audio/wav`).
2. The recorded audio is packaged as a `File` and submitted via `FormData` to `POST /transcribe` without hardcoded content-type headers.
3. The returned Roman Hinglish text is populated into:
   - The **Voice Assistant / Speak Your Issue** section on the homepage
   - The **AI Chat input textarea** inside the CivicSeva Assistant drawer
4. Citizens can review and edit their transcribed text before sending it to the existing CivicSeva Gemini AI chatbot.

---

## 🌐 Production Deployment Architecture

Because `faster-whisper` and CTranslate2 require compiled native libraries, CPU inference, and model weights, the voice service cannot run on ephemeral serverless platforms like Vercel Functions.

### Recommended Architecture:
- **Frontend (Vercel):** React + Vite SPA (static assets + serverless Gemini `/api/chat`).
- **Voice Service Backend:** Python FastAPI container on Render, Railway, Hugging Face Spaces, Fly.io, or Cloud Run.

### Connecting Frontend to Production Voice Service:
1. Deploy `voice-service/` using Docker or standard Python buildpacks to your cloud provider (e.g. `https://voice.civicseva.org` or `https://civicseva-voice.onrender.com`).
2. In your Vercel Project Settings under **Environment Variables**, configure:
   ```bash
   VITE_VOICE_API_URL=https://your-voice-service-subdomain.com
   ```
3. In local development, the frontend automatically defaults to `http://localhost:8000` when `VITE_VOICE_API_URL` is omitted.
