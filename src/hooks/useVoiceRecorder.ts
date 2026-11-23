import { useState, useRef, useEffect, useCallback } from 'react';
import { transcribeAudioBlob } from '../services/voiceService';

export interface UseVoiceRecorderOptions {
  onTranscribeSuccess?: (text: string) => void;
  onTranscribeError?: (error: string) => void;
}

export function useVoiceRecorder(options: UseVoiceRecorderOptions = {}) {
  const { onTranscribeSuccess, onTranscribeError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up stream & timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/wav',
    ];
    for (const t of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  };

  const startRecording = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Microphone access is not supported by your browser or environment.';
      setError(msg);
      onTranscribeError?.(msg);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = getSupportedMimeType();
      const recorderOptions: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(250); // collect chunks every 250ms
      setIsRecording(true);
      setRecordingDuration(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to start audio recording:', err);
      let errMsg = 'Failed to access microphone. Please check your browser permissions.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errMsg = 'No microphone device was detected on your system.';
      }
      setError(errMsg);
      onTranscribeError?.(errMsg);
      setIsRecording(false);
    }
  }, [onTranscribeError]);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve('');
        return;
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      recorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        setError(null);

        // Stop all audio hardware tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        if (audioBlob.size < 100) {
          const errMsg = 'Recording was too short or silent.';
          setError(errMsg);
          setIsTranscribing(false);
          onTranscribeError?.(errMsg);
          resolve('');
          return;
        }

        try {
          const res = await transcribeAudioBlob(audioBlob);
          if (res.success && res.text) {
            setTranscribedText(res.text);
            onTranscribeSuccess?.(res.text);
            resolve(res.text);
          } else {
            const errMsg = res.error || 'No speech recognized. Please try speaking closer to the microphone.';
            setError(errMsg);
            onTranscribeError?.(errMsg);
            resolve('');
          }
        } catch (err: any) {
          const errMsg = err?.message || 'Error occurred during transcription.';
          setError(errMsg);
          onTranscribeError?.(errMsg);
          resolve('');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.stop();
    });
  }, [onTranscribeSuccess, onTranscribeError]);

  const cancelRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setIsTranscribing(false);
    setRecordingDuration(0);
  }, []);

  const clearState = useCallback(() => {
    setTranscribedText('');
    setError(null);
    setRecordingDuration(0);
  }, []);

  return {
    isRecording,
    isTranscribing,
    recordingDuration,
    transcribedText,
    setTranscribedText,
    error,
    setError,
    startRecording,
    stopRecording,
    cancelRecording,
    clearState,
  };
}
