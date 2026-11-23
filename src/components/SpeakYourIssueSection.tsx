import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Radio,
  FileEdit,
  ArrowRight
} from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { checkVoiceServiceHealth } from '../services/voiceService';

interface SpeakYourIssueSectionProps {
  onSpeakSubmit?: (text: string) => void;
  className?: string;
  compact?: boolean;
}

export const SpeakYourIssueSection: React.FC<SpeakYourIssueSectionProps> = ({
  onSpeakSubmit,
  className = '',
  compact = false,
}) => {
  const [serviceOnline, setServiceOnline] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    isRecording,
    isTranscribing,
    recordingDuration,
    transcribedText,
    setTranscribedText,
    error,
    setError,
    startRecording,
    stopRecording,
    clearState,
  } = useVoiceRecorder({
    onTranscribeSuccess: () => {
      setIsEditing(true);
    },
  });

  // Check health on mount
  useEffect(() => {
    let mounted = true;
    checkVoiceServiceHealth().then((healthy) => {
      if (mounted) setServiceOnline(healthy);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      clearState();
      setIsEditing(false);
      await startRecording();
    }
  };

  const handleSubmit = () => {
    const textToSubmit = transcribedText.trim();
    if (!textToSubmit) {
      setError('Please record or enter your issue first.');
      return;
    }

    if (onSpeakSubmit) {
      onSpeakSubmit(textToSubmit);
    } else {
      // Dispatch global event for the floating assistant
      window.dispatchEvent(
        new CustomEvent('open-civic-assistant', {
          detail: { text: textToSubmit, autoSend: true },
        })
      );
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const samplePrompts = [
    'Mere area mein road bahut kharab hai',
    'Aadhaar card mein address update kaise karu?',
    'New voter ID apply karne ke liye kya documents chahiye?',
  ];

  return (
    <section
      aria-labelledby="voice-assistant-heading"
      className={`rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'} shadow-sm transition-all duration-200 relative overflow-hidden ${className}`}
    >
      {/* Background Subtle Accent Gradients */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6">
        {/* Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span>Voice Assistant • Hinglish AI</span>
              <span className="text-blue-300 dark:text-blue-700">•</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">Whisper Tiny</span>
            </div>
            <h2
              id="voice-assistant-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2"
            >
              <span>Voice Assistant / Speak Your Issue</span>
              <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">
                (बोलकर समस्या बताएं)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Describe your civic complaint or service query naturally in Hindi or Hinglish. Our local speech engine converts your voice to text so you can review, edit, and get instant answers from CivicSeva AI.
            </p>
          </div>

          {/* Local Service Status Pill */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                serviceOnline === true
                  ? 'bg-emerald-500 animate-pulse'
                  : serviceOnline === false
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span>
              {serviceOnline === true
                ? 'Voice Engine Online'
                : serviceOnline === false
                ? 'Voice Service Offline'
                : 'Connecting to Engine...'}
            </span>
          </div>
        </div>

        {/* Voice Recording Control Box */}
        <div className="bg-slate-50 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
          {/* Animated Mic Button */}
          <div className="relative">
            {/* Pulsing ring while recording */}
            {isRecording && (
              <>
                <span className="absolute inset-0 rounded-full bg-rose-500/30 dark:bg-rose-500/40 animate-ping pointer-events-none" />
                <span className="absolute -inset-3 rounded-full bg-rose-500/15 dark:bg-rose-500/20 animate-pulse pointer-events-none" />
              </>
            )}

            <button
              type="button"
              onClick={handleToggleRecord}
              disabled={isTranscribing}
              aria-label={isRecording ? 'Stop recording voice' : 'Start speaking your issue'}
              className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg cursor-pointer focus:outline-none focus:ring-4 ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-rose-400/50 scale-105 shadow-rose-600/30'
                  : isTranscribing
                  ? 'bg-slate-300 dark:bg-zinc-800 text-slate-500 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white ring-blue-400/40 hover:scale-105 shadow-blue-600/25'
              }`}
            >
              {isRecording ? (
                <div className="flex flex-col items-center">
                  <MicOff className="w-8 h-8 sm:w-9 sm:h-9 animate-bounce" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Stop</span>
                </div>
              ) : isTranscribing ? (
                <div className="flex flex-col items-center">
                  <Sparkles className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-bold mt-1">Transcribing</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Tap to Speak</span>
                </div>
              )}
            </button>
          </div>

          {/* Recording State & Visualizer */}
          <div className="space-y-1.5">
            {isRecording ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span>Recording: {formatDuration(recordingDuration)}</span>
                </div>
                {/* Audio Wave Bars Simulation */}
                <div className="flex items-center justify-center gap-1 h-6">
                  <span className="w-1 bg-rose-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                  <span className="w-1 bg-rose-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-6" />
                  <span className="w-1 bg-rose-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4" />
                  <span className="w-1 bg-rose-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-5" />
                  <span className="w-1 bg-rose-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tap the red button when finished speaking.
                </p>
              </div>
            ) : isTranscribing ? (
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                <span>Whisper Tiny Hinglish v2 is transcribing your voice...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speak clearly in Hinglish or Hindi. Example: <em>&ldquo;Mere area mein road bahut kharab hai&rdquo;</em>
              </p>
            )}
          </div>

          {/* Quick sample speech pill buttons */}
          {!isRecording && !isTranscribing && !transcribedText && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] text-slate-400">Try asking:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTranscribedText(p);
                    setIsEditing(true);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition shadow-2xs cursor-pointer"
                >
                  &ldquo;{p}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Notice */}
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold">{error}</p>
              {error.includes('voice-service') || error.includes(':8000') || error.includes('VITE_VOICE_API_URL') ? (
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Tip: In development, run <code>cd voice-service && python main.py</code> to launch the local speech recognition engine. In production, configure <code>VITE_VOICE_API_URL</code>.
                </p>
              ) : null}
            </div>
          </div>
        )}

        {/* Transcribed Text Preview & Editor Box */}
        {(transcribedText || isEditing) && (
          <div className="space-y-3 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <FileEdit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Transcribed Hinglish Text (Review & Edit before sending):</span>
              </div>
              <button
                type="button"
                onClick={clearState}
                className="text-xs text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer"
              >
                Clear
              </button>
            </div>

            <textarea
              rows={3}
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              placeholder="Your transcribed Hinglish text will appear here. You can edit it as needed..."
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 resize-none transition"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Speech recognized in Roman Hinglish. Click below to consult CivicSeva AI.</span>
              </div>

              {/* Primary Clear CTA: "Speak Your Issue" */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  disabled={isRecording || isTranscribing}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!transcribedText.trim()}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 rtl-flip" />
                  <span>Speak Your Issue</span>
                  <ArrowRight className="w-4 h-4 rtl-flip" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
