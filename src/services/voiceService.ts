/**
 * CivicSeva Voice Service Client
 * Handles audio blob submission to the local faster-whisper Hinglish voice service.
 */

export interface TranscriptionResponse {
  success: boolean;
  text: string;
  error?: string;
}

const DEFAULT_VOICE_SERVICE_URL = 'http://localhost:8000';

export function getVoiceServiceUrl(): string {
  return import.meta.env.VITE_VOICE_SERVICE_URL || DEFAULT_VOICE_SERVICE_URL;
}

/**
 * Checks if the local voice service is reachable.
 */
export async function checkVoiceServiceHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${getVoiceServiceUrl()}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Sends an audio blob (WebM/WAV) to the local voice service for Roman Hinglish transcription.
 */
export async function transcribeAudioBlob(audioBlob: Blob): Promise<TranscriptionResponse> {
  const serviceUrl = getVoiceServiceUrl();
  const formData = new FormData();
  const ext = audioBlob.type.includes('wav') ? 'wav' : 'webm';
  formData.append('file', audioBlob, `recording.${ext}`);

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
    return {
      success: false,
      text: '',
      error: `Local voice service is not reachable at ${serviceUrl}. Please ensure the service is running (e.g. \`python voice-service/main.py\`).`,
    };
  }
}
