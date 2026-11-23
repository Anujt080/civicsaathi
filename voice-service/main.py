import os
import shutil
import tempfile
import logging
from typing import Optional

# PyAV 19 compatibility patch for faster-whisper
try:
    import av
    _orig_av_open = av.open
    def _patched_av_open(*args, **kwargs):
        kwargs.pop("metadata_errors", None)
        return _orig_av_open(*args, **kwargs)
    av.open = _patched_av_open
except Exception:
    pass

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import snapshot_download
from faster_whisper import WhisperModel

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("voice-service")

MODEL_ID = os.getenv("WHISPER_MODEL_ID", "abhishekgautamm/whisper-tiny-hinglish-v2")
DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")

class TranscriberManager:
    """
    Modular transcriber manager for Hinglish speech recognition.
    Encapsulates faster-whisper model loading and Roman Hinglish transcription.
    Allows easy swapping of ASR models.
    """
    def __init__(self, model_id: str = MODEL_ID, device: str = DEVICE, compute_type: str = COMPUTE_TYPE):
        self.model_id = model_id
        self.device = device
        self.compute_type = compute_type
        self.model: Optional[WhisperModel] = None

    def load_model(self) -> WhisperModel:
        if self.model is not None:
            return self.model

        logger.info(f"Downloading/verifying model files for {self.model_id} (ct2/int8)...")
        try:
            # Download ct2/int8 directory for fast CPU inference
            model_root = snapshot_download(
                repo_id=self.model_id,
                allow_patterns=["ct2/int8/*"]
            )
            ct2_path = os.path.join(model_root, "ct2", "int8")
            if not os.path.exists(ct2_path):
                ct2_path = model_root
        except Exception as e:
            logger.warning(f"Selective snapshot download failed, falling back to full repo ID: {e}")
            ct2_path = self.model_id

        logger.info(f"Loading WhisperModel from {ct2_path} on {self.device} ({self.compute_type})...")
        self.model = WhisperModel(ct2_path, device=self.device, compute_type=self.compute_type)
        logger.info("WhisperModel loaded successfully and ready for inference.")
        return self.model

    def transcribe(self, audio_file_path: str, language: str = "en") -> str:
        """
        Transcribes the audio file using faster-whisper.
        Using language='en' produces Romanized Hinglish output.
        """
        model = self.load_model()
        segments, info = model.transcribe(
            audio_file_path,
            language=language,
            beam_size=5,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=400)
        )
        text_chunks = [segment.text.strip() for segment in segments if segment.text.strip()]
        return " ".join(text_chunks).strip()

transcriber_manager = TranscriberManager()

app = FastAPI(
    title="CivicSeva Voice-to-Text Service",
    description="Local Hinglish speech-to-text service powered by faster-whisper and whisper-tiny-hinglish-v2",
    version="1.0.0"
)

# Enable CORS for local frontend development and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing voice model on startup...")
    try:
        transcriber_manager.load_model()
    except Exception as e:
        logger.error(f"Error pre-loading voice model during startup: {e}")

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CivicSeva Hinglish Voice Service",
        "model": MODEL_ID,
        "device": DEVICE,
        "compute_type": COMPUTE_TYPE
    }

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No audio file provided")

    original_filename = file.filename or "recording.webm"
    _, ext = os.path.splitext(original_filename)
    if not ext:
        ext = ".webm"

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    temp_path = temp_file.name

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(temp_path)
        logger.info(f"Received audio file {original_filename} ({file_size} bytes)")

        if file_size == 0:
            return {"success": False, "error": "Empty audio file received", "text": ""}

        # Transcribe audio with language="en" so Hindi/Hinglish is returned in Roman script
        transcribed_text = transcriber_manager.transcribe(temp_path, language="en")
        logger.info(f"Transcription result: '{transcribed_text}'")

        return {
            "success": True,
            "text": transcribed_text
        }
    except Exception as e:
        logger.exception(f"Transcription error: {e}")
        return {
            "success": False,
            "error": str(e),
            "text": ""
        }
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting CivicSeva Voice Service on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=False)
