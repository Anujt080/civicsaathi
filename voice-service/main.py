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

# Configure CORS for local development and production Vercel origins
default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4173",
]

env_origins = os.getenv("ALLOWED_ORIGINS", "").strip()
if env_origins:
    if env_origins == "*":
        allowed_origins = ["*"]
        allow_creds = False
    else:
        allowed_origins = [origin.strip() for origin in env_origins.split(",") if origin.strip()]
        for dev_orig in default_origins:
            if dev_orig not in allowed_origins:
                allowed_origins.append(dev_orig)
        allow_creds = True
else:
    allowed_origins = default_origins
    allow_creds = True

allow_origin_regex = os.getenv(
    "ALLOW_ORIGIN_REGEX",
    r"^https://.*\.vercel\.app$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allow_origin_regex if allow_creds else None,
    allow_credentials=allow_creds,
    allow_methods=["GET", "POST", "OPTIONS"],
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

def detect_audio_extension(data: bytes, filename: Optional[str] = None, content_type: Optional[str] = None) -> str:
    """
    Safely inspects file magic bytes to determine the correct audio container format,
    preventing PyAV / FFmpeg demuxer mismatch errors (e.g. Invalid data found when processing input).
    """
    if len(data) >= 4:
        if data[:4] == b"\x1aE\xdf\xa3":
            return ".webm"
        if data[:4] == b"RIFF":
            return ".wav"
        if data[:4] == b"OggS":
            return ".ogg"
        if data[:4] == b"fLaC":
            return ".flac"
    if len(data) >= 8 and data[4:8] == b"ftyp":
        return ".mp4"

    ct = (content_type or "").lower()
    if "webm" in ct:
        return ".webm"
    if "wav" in ct or "wave" in ct:
        return ".wav"
    if "ogg" in ct:
        return ".ogg"
    if "mp4" in ct or "m4a" in ct or "aac" in ct:
        return ".mp4"

    if filename:
        _, ext = os.path.splitext(filename)
        if ext:
            return ext.lower()

    return ".webm"

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No audio file provided")

    original_filename = file.filename or "recording.webm"
    content_type = file.content_type or "audio/webm"

    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded audio file: {e}")
        return {"success": False, "error": f"Failed to read audio file: {e}", "text": ""}

    file_size = len(content) if content else 0
    # Safe debugging log: filename, content_type, size (never log secrets or keys)
    logger.info(
        f"Received audio upload: filename='{original_filename}', "
        f"content_type='{content_type}', size={file_size} bytes"
    )

    if file_size == 0:
        logger.warning("Empty audio payload received (0 bytes)")
        return {"success": False, "error": "Empty audio file received (0 bytes)", "text": ""}

    if file_size < 100:
        logger.warning(f"Audio payload too small ({file_size} bytes)")
        return {
            "success": False,
            "error": f"Audio file is too small ({file_size} bytes) to contain valid audio data",
            "text": ""
        }

    detected_ext = detect_audio_extension(content, original_filename, content_type)
    logger.info(f"Resolved container extension: '{detected_ext}' for decoding")

    fd, temp_path = tempfile.mkstemp(suffix=detected_ext)
    try:
        with os.fdopen(fd, "wb") as buffer:
            buffer.write(content)
            buffer.flush()

        # Transcribe audio with language="en" so Hindi/Hinglish is returned in Roman script
        transcribed_text = transcriber_manager.transcribe(temp_path, language="en")
        logger.info(f"Transcription successful ({len(transcribed_text)} chars): '{transcribed_text}'")

        return {
            "success": True,
            "text": transcribed_text
        }
    except Exception as e:
        logger.exception(f"Transcription error: {e}")
        err_msg = str(e)
        if "Invalid data found" in err_msg or "InvalidDataError" in err_msg:
            user_msg = "Audio data could not be decoded. Please speak clearly into your microphone and try again."
        else:
            user_msg = f"Transcription error: {err_msg}"
        return {
            "success": False,
            "error": user_msg,
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
