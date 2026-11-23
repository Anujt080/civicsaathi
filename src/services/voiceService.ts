/**
 * CivicSeva Voice Service Client
 * Handles audio blob submission to the faster-whisper Hinglish voice service.
 * Supports configurable VITE_VOICE_API_URL for production deployment,
 * falling back to http://localhost:8000 in local development.
 */

export interface TranscriptionResponse {
  success: boolean;
  text: string;
  error?: string;
}

const DEFAULT_DEV_VOICE_URL = 'http://localhost:8000';

/**
 * Returns the resolved voice service endpoint URL.
 * 1. Checks VITE_VOICE_API_URL (production standard)
 * 2. Checks VITE_VOICE_SERVICE_URL (legacy fallback)
 * 3. In dev mode (import.meta.env.DEV), defaults to http://localhost:8000
 * 4. In production builds without a configured URL, returns empty string to prevent mixed-content blocks
 */
export function getVoiceServiceUrl(): string {
  const configured =
    import.meta.env.VITE_VOICE_API_URL || import.meta.env.VITE_VOICE_SERVICE_URL;

  if (configured && typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim().replace(/\/+$/, '');
  }

  // Local development fallback (Vite dev server or running locally on loopback)
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0');

  if (import.meta.env.DEV || isLocalhost) {
    return DEFAULT_DEV_VOICE_URL;
  }

  return '';
}

/**
 * Returns true if the voice service has a configured or local endpoint.
 */
export function isVoiceServiceConfigured(): boolean {
  return Boolean(getVoiceServiceUrl());
}

/**
 * Resolves appropriate file extension based on MIME type.
 */
export function getExtensionFromMime(mimeType: string): string {
  const lower = (mimeType || '').toLowerCase();
  if (lower.includes('webm')) return 'webm';
  if (lower.includes('wav')) return 'wav';
  if (lower.includes('ogg')) return 'ogg';
  if (lower.includes('mp4') || lower.includes('m4a') || lower.includes('aac')) return 'mp4';
  return 'webm';
}

/**
 * Checks if the voice service is reachable.
 */
export async function checkVoiceServiceHealth(): Promise<boolean> {
  const serviceUrl = getVoiceServiceUrl();
  if (!serviceUrl) {
    return false;
  }

  try {
    const res = await fetch(`${serviceUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Sends an audio blob (WebM/WAV/MP4/OGG) to the voice service for Roman Hinglish transcription.
 */
export async function transcribeAudioBlob(audioBlob: Blob): Promise<TranscriptionResponse> {
  const serviceUrl = getVoiceServiceUrl();

  if (!serviceUrl) {
    return {
      success: false,
      text: '',
      error:
        'Voice service is not configured for production. Please set the VITE_VOICE_API_URL environment variable in your hosting platform.',
    };
  }

  if (!audioBlob || audioBlob.size < 100) {
    return {
      success: false,
      text: '',
      error: 'Audio recording is empty or too short. Please speak clearly and try again.',
    };
  }

  const mimeType = audioBlob.type || 'audio/webm';
  const ext = getExtensionFromMime(mimeType);

  // Package as a proper File inside FormData; do NOT manually set Content-Type header
  // so the browser automatically populates multipart/form-data with the correct boundary
  const formData = new FormData();
  const audioFile = new File([audioBlob], `recording.${ext}`, { type: mimeType });
  formData.append('file', audioFile, `recording.${ext}`);

  try {
    const res = await fetch(`${serviceUrl}/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      return {
        success: false,
        text: '',
        error: `Voice service error (HTTP ${res.status}): ${errorText || res.statusText}`,
      };
    }

    const data = await res.json();
    return {
      success: !!data.success,
      text: data.text || '',
      error: data.error,
    };
  } catch (err: any) {
    console.warn('Voice service unreachable at', serviceUrl, err);
    const isDev = import.meta.env.DEV;
    return {
      success: false,
      text: '',
      error: isDev
        ? `Local voice service is not reachable at ${serviceUrl}. Please ensure the service is running (e.g. \`python voice-service/main.py\`).`
        : 'Voice service is currently unreachable. Please verify your network connection or try again shortly.',
    };
  }
}
