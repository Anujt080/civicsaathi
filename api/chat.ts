// Vercel Serverless Function: /api/chat
// Server-side handler for Google Gemini generateContent API with rate-limit and fallback handling

function scrubSensitivePII(text: string): string {
  if (!text) return "";
  const aadhaarRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
  const phoneRegex = /\b(?:\+91|91)?[6-9]\d{9}\b/g;

  return text
    .replace(aadhaarRegex, "[REDACTED_AADHAAR]")
    .replace(panRegex, "[REDACTED_PAN]")
    .replace(phoneRegex, "[REDACTED_PHONE]");
}

const CIVICSAATHI_SYSTEM_PROMPT = `You are the CivicSaathi AI Assistant (सिविक साथी), an official civic advisor helping Indian citizens understand and prepare for government services.

Your primary mission:
1. Explain document categories clearly:
   - POI (Proof of Identity): E.g., Voter ID, Passport, PAN Card, Driving Licence, Govt Photo ID.
   - POA (Proof of Address): E.g., Passport, Electricity Bill (<3 months old), Water Bill, Bank Passbook with address.
   - DOB (Proof of Date of Birth): E.g., Birth Certificate, 10th Standard Marksheet, Passport, PAN Card.
   - POR (Proof of Relationship): E.g., Birth Certificate, Ration Card, PDS Card with family head.

2. Guide citizens through CivicSaathi's 3-step workflow:
   - Step 1: Pre-submission Checklist (Confirming physical papers vs conditional items).
   - Step 2: Verification & Consistency Check (Checking for name spelling and DOB discrepancies).
   - Step 3: Submission Mode (Applying via official online portals vs visiting a local Seva Kendra).

3. Provide accurate information for indexed services:
   - Central Services:
     * New Aadhaar Enrolment: Free of charge, 15-30 days, in-person biometric capture at ASK/bank/post office. Official portal: https://uidai.gov.in.
     * Aadhaar Update: ₹50 for demographic (name, address, DOB), ₹100 for biometric. Official portal: https://uidai.gov.in.
     * Fresh Indian Passport: Normal fee ₹1,500 (36 pages), Tatkaal ₹3,500. Processing 10-30 days. Non-ECR status requires 10th pass certificate. Official portal: https://passportindia.gov.in.
     * PAN Card Correction/Reprint: Physical delivery ₹50 in India. Official portal: https://onlineservices.nsdl.com.
     * Driving Licence (LL & DL): Parivahan portal: https://parivahan.gov.in.
   - Chhattisgarh State Services:
     * Domicile Certificate (निवास प्रमाण पत्र): 15+ years residency proof, revenue records, patwari/parshad certificate. Official portal: https://edistrict.cgstate.gov.in.
     * Caste Certificate (SC/ST/OBC): Historical land records, 1950/1984 record proofs, vanshavali (family tree). Official portal: https://edistrict.cgstate.gov.in.
     * Social Pensions (IGNOAPS, IGNWPS, IGNDPS): BPL cardholders, 60+ for IGNOAPS, widow 40+ for IGNWPS, 80%+ disability for IGNDPS.

4. Guidelines for tone and safety:
   - Be concise, supportive, and respectful.
   - Format responses with bullet points, bold key terms, and markdown links where helpful.
   - Suggest relevant CivicSaathi internal routes: "/services" (all services), "/offices" (kendra locator), or service links.
   - NEVER invent government fees, eligibility requirements, or laws. If uncertain, explicitly state: "Please verify with the official facilitation officer at your nearest Lok Seva Kendra."
   - NEVER claim that you have submitted the citizen's application or officially verified their identity.
   - NEVER ask users for personal Aadhaar numbers, PAN numbers, OTPs, or financial credentials.`;

const VERIFIED_GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
];

interface ErrorAnalysis {
  isQuotaExhausted: boolean;
  isThrottled: boolean;
  isProviderUnavailable: boolean;
  isAuthError: boolean;
  message: string;
}

function analyzeGeminiError(status: number, errorData: any): ErrorAnalysis {
  const err = errorData?.error || errorData || {};
  const msg = (err.message || "").toLowerCase();
  const statusStr = (err.status || "").toLowerCase();

  const isAuthError =
    status === 401 ||
    status === 403 ||
    statusStr.includes("permission_denied") ||
    statusStr.includes("unauthenticated") ||
    msg.includes("api key") ||
    msg.includes("unauthorized");

  const isQuotaExhausted =
    status === 429 &&
    (msg.includes("quota") || msg.includes("resource_exhausted") || statusStr.includes("resource_exhausted"));

  const isThrottled =
    status === 429 ||
    statusStr.includes("resource_exhausted") ||
    msg.includes("rate limit") ||
    msg.includes("too many requests");

  const isProviderUnavailable =
    status === 503 ||
    status === 502 ||
    status === 504 ||
    statusStr.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("overloaded");

  let safeMessage = "AI assistant is temporarily unavailable. Please try again shortly.";
  if (isAuthError) {
    safeMessage = "AI assistant authentication failed. Please check server configuration.";
  } else if (isQuotaExhausted) {
    safeMessage = "The AI service daily quota has been reached. Please try again later.";
  } else if (isThrottled || isProviderUnavailable) {
    safeMessage = "The AI service is experiencing high traffic. Please wait a moment before trying again.";
  }

  return {
    isQuotaExhausted,
    isThrottled,
    isProviderUnavailable,
    isAuthError,
    message: safeMessage,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const configuredModel = process.env.GEMINI_MODEL || VERIFIED_GEMINI_MODELS[0];

  if (!apiKey) {
    return res.status(503).json({
      error:
        'Google Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in server environment variables or backend secrets.',
      code: 'MISSING_API_KEY',
    });
  }

  try {
    const { message, history, context } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty', code: 'EMPTY_MESSAGE' });
    }

    if (message.length > 3000) {
      return res.status(400).json({ error: 'Message exceeds 3000 character limit', code: 'MESSAGE_TOO_LONG' });
    }

    const cleanUserMessage = scrubSensitivePII(message.trim());

    let activeContextNote = '';
    if (context?.activeServiceName) {
      activeContextNote = `\nCitizen is currently viewing: "${context.activeServiceName}" (Category: ${context.activeServiceCategory || 'General'}). Focus advice on this service where relevant.`;
    }

    const systemInstruction = CIVICSAATHI_SYSTEM_PROMPT + activeContextNote;

    // Convert history and current message to Google Gemini contents structure (user / model turns)
    const geminiContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      for (const turn of recentHistory) {
        if (turn.sender === 'user' && turn.text?.trim()) {
          const cleanTurn = scrubSensitivePII(turn.text.trim());
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

    // Append current user message
    if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === 'user') {
      geminiContents[geminiContents.length - 1].parts[0].text += '\n' + cleanUserMessage;
    } else {
      geminiContents.push({
        role: 'user',
        parts: [{ text: cleanUserMessage }],
      });
    }

    const candidateModels = Array.from(new Set([configuredModel, ...VERIFIED_GEMINI_MODELS]));

    let lastError: ErrorAnalysis | null = null;

    for (const modelToTry of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
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

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const candidate = data.candidates?.[0];
          const replyText = candidate?.content?.parts?.[0]?.text;

          if (replyText) {
            return res.status(200).json({
              reply: replyText,
              model: modelToTry,
            });
          }
        }

        const errorData = await geminiResponse.json().catch(() => ({}));
        const analysis = analyzeGeminiError(geminiResponse.status, errorData);
        lastError = analysis;

        // If auth error, do not retry other models as key is invalid
        if (analysis.isAuthError) {
          break;
        }

        // On 503 (high demand) or 429, try next fallback candidate model
        continue;
      } catch (_err) {
        lastError = {
          isQuotaExhausted: false,
          isThrottled: false,
          isProviderUnavailable: true,
          isAuthError: false,
          message: 'Request timeout or network failure reaching the Google Gemini service.',
        };
        continue;
      }
    }

    if (lastError?.isAuthError) {
      return res.status(401).json({
        error: lastError.message,
        code: 'AUTH_ERROR',
      });
    }

    if (lastError?.isQuotaExhausted) {
      return res.status(429).json({
        error: lastError.message,
        code: 'DAILY_QUOTA_EXHAUSTED',
      });
    }

    if (lastError?.isThrottled) {
      return res.status(429).json({
        error: lastError.message,
        code: 'RATE_LIMIT_EXHAUSTED',
      });
    }

    return res.status(502).json({
      error: lastError?.message || 'AI assistant is temporarily unavailable. Please try again shortly.',
      code: 'PROVIDERS_UNAVAILABLE',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred processing your request',
      code: 'INTERNAL_ERROR',
    });
  }
}
