import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.SUPABASE_URL || '';
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || '';

  return {
    plugins: [
      react(),
      {
        name: 'local-dev-api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res, next) => {
            if (req.method !== 'POST') return next();

            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');

              const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
              const configuredModel = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.6-flash';

              if (!geminiApiKey) {
                res.statusCode = 503;
                res.end(
                  JSON.stringify({
                    error:
                      'Google Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in your .env file or server environment.',
                    code: 'MISSING_API_KEY',
                  })
                );
                return;
              }

              try {
                const body = JSON.parse(bodyStr || '{}');
                const { message, history, context } = body;

                if (!message || typeof message !== 'string' || !message.trim()) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Message cannot be empty', code: 'EMPTY_MESSAGE' }));
                  return;
                }

                if (message.length > 3000) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Message exceeds 3000 character limit', code: 'MESSAGE_TOO_LONG' }));
                  return;
                }

                // Mask sensitive citizen PII
                const aadhaarRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
                const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
                const phoneRegex = /\b(?:\+91|91)?[6-9]\d{9}\b/g;
                const cleanMessage = message
                  .trim()
                  .replace(aadhaarRegex, '[REDACTED_AADHAAR]')
                  .replace(panRegex, '[REDACTED_PAN]')
                  .replace(phoneRegex, '[REDACTED_PHONE]');

                let activeContextNote = '';
                if (context?.activeServiceName) {
                  activeContextNote = `\nCitizen is currently viewing: "${context.activeServiceName}" (Category: ${context.activeServiceCategory || 'General'}). Focus advice on this service where relevant.`;
                }

                const systemInstruction = `You are the CivicSeva AI Assistant (सिविक सेवा), an official civic advisor helping Indian citizens understand and prepare for government services.
Your primary mission:
1. Explain document categories clearly (POI, POA, DOB, POR).
2. Guide citizens through CivicSeva's 3-step workflow (Pre-submission Checklist -> Verification & Consistency Check -> Submission Mode).
3. Provide accurate information for indexed services (Central: Aadhaar, Passport, PAN, DL; Chhattisgarh: Domicile, Caste, Pensions).
4. Tone & safety: Be concise, supportive, respectful. Suggest internal routes (/services, /offices). NEVER invent fees or laws. NEVER ask for Aadhaar numbers, PAN, OTPs, or passwords. Never claim to have officially submitted applications.${activeContextNote}`;

                // Convert history to Gemini contents structure
                const geminiContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

                if (Array.isArray(history)) {
                  for (const turn of history.slice(-8)) {
                    if (turn.sender === 'user' && turn.text?.trim()) {
                      const cleanTurn = turn.text
                        .trim()
                        .replace(aadhaarRegex, '[REDACTED_AADHAAR]')
                        .replace(panRegex, '[REDACTED_PAN]')
                        .replace(phoneRegex, '[REDACTED_PHONE]');
                      if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === 'user') {
                        geminiContents[geminiContents.length - 1].parts[0].text += '\n' + cleanTurn;
                      } else {
                        geminiContents.push({
                          role: 'user',
                          parts: [{ text: cleanTurn }],
                        });
                      }
                    } else if (turn.sender === 'assistant' && turn.text?.trim()) {
                      if (geminiContents.length === 0) continue;
                      if (geminiContents[geminiContents.length - 1].role === 'model') {
                        geminiContents[geminiContents.length - 1].parts[0].text += '\n' + turn.text.trim();
                      } else {
                        geminiContents.push({
                          role: 'model',
                          parts: [{ text: turn.text.trim() }],
                        });
                      }
                    }
                  }
                }

                // Append current user prompt
                if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === 'user') {
                  geminiContents[geminiContents.length - 1].parts[0].text += '\n' + cleanMessage;
                } else {
                  geminiContents.push({
                    role: 'user',
                    parts: [{ text: cleanMessage }],
                  });
                }

                const verifiedGeminiModels = [
                  'gemini-3.1-flash-lite',
                  'gemini-3.5-flash-lite',
                  'gemini-3.6-flash',
                  'gemini-3.8-flash',
                ];

                const candidateModels = Array.from(new Set([configuredModel, ...verifiedGeminiModels]));

                let lastError = null;

                for (const modelToTry of candidateModels) {
                  try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 25000);

                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${geminiApiKey}`;

                    const geminiRes = await fetch(geminiUrl, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        systemInstruction: {
                          parts: [{ text: systemInstruction }],
                        },
                        contents: geminiContents,
                        generationConfig: {
                          temperature: 0.3,
                          maxOutputTokens: 1024,
                        },
                      }),
                      signal: controller.signal,
                    });

                    clearTimeout(timeoutId);

                    if (geminiRes.ok) {
                      const geminiData = await geminiRes.json();
                      const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

                      if (reply) {
                        res.statusCode = 200;
                        res.end(JSON.stringify({ reply, model: modelToTry }));
                        return;
                      }
                    }

                    const errorData = await geminiRes.json().catch(() => ({}));
                    const errObj = errorData?.error || errorData || {};
                    const errMsg = (errObj.message || '').toLowerCase();
                    const statusStr = (errObj.status || '').toLowerCase();

                    const isAuthError =
                      geminiRes.status === 401 ||
                      geminiRes.status === 403 ||
                      statusStr.includes('permission_denied') ||
                      statusStr.includes('unauthenticated');

                    const isQuotaExhausted =
                      geminiRes.status === 429 &&
                      (errMsg.includes('quota') || errMsg.includes('resource_exhausted'));

                    const isThrottled =
                      geminiRes.status === 429 ||
                      statusStr.includes('resource_exhausted');

                    let safeMsg = 'AI assistant is temporarily unavailable. Please try again shortly.';
                    if (isAuthError) {
                      safeMsg = 'AI assistant authentication failed. Please check server configuration.';
                    } else if (isQuotaExhausted) {
                      safeMsg = 'The AI service daily quota has been reached. Please try again later.';
                    } else if (isThrottled) {
                      safeMsg = 'The AI service is experiencing high traffic. Please wait a moment before trying again.';
                    }

                    lastError = {
                      status: geminiRes.status,
                      isAuthError,
                      isQuotaExhausted,
                      isThrottled,
                      message: safeMsg,
                    };

                    if (isAuthError) {
                      break;
                    }

                    continue;
                  } catch (_err) {
                    lastError = {
                      status: 504,
                      isAuthError: false,
                      isQuotaExhausted: false,
                      isThrottled: false,
                      message: 'Request timeout or network failure reaching the Google Gemini service.',
                    };
                    continue;
                  }
                }

                if (lastError?.isAuthError) {
                  res.statusCode = 401;
                  res.end(
                    JSON.stringify({
                      error: lastError.message,
                      code: 'AUTH_ERROR',
                    })
                  );
                  return;
                }

                if (lastError?.isQuotaExhausted) {
                  res.statusCode = 429;
                  res.end(
                    JSON.stringify({
                      error: lastError.message,
                      code: 'DAILY_QUOTA_EXHAUSTED',
                    })
                  );
                  return;
                }

                if (lastError?.isThrottled) {
                  res.statusCode = 429;
                  res.end(
                    JSON.stringify({
                      error: lastError.message,
                      code: 'RATE_LIMIT_EXHAUSTED',
                    })
                  );
                  return;
                }

                res.statusCode = 502;
                res.end(
                  JSON.stringify({
                    error:
                      lastError?.message ||
                      'AI assistant is temporarily unavailable. Please try again shortly.',
                    code: 'PROVIDERS_UNAVAILABLE',
                  })
                );
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message, code: 'INTERNAL_ERROR' }));
              }
            });
          });
        },
      },
    ],
    // Exposes variables starting with SUPABASE_ to import.meta.env
    envPrefix: ['SUPABASE_', 'VITE_'],
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
  };
});
