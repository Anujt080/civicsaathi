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

1. The frontend records citizen speech in the browser via `MediaRecorder`.
2. The recorded audio blob is sent directly to `POST http://localhost:8000/transcribe`.
3. The returned Roman Hinglish text is populated into:
   - The **Voice Assistant / Speak Your Issue** section on the homepage
   - The **AI Chat input textarea** inside the CivicSeva Assistant drawer
4. Citizens can review and edit their transcribed text before sending it to the existing CivicSeva Gemini AI chatbot.
