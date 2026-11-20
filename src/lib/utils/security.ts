/**
 * TIMELOOP AI Security Utilities
 * Includes Rate Limiting, Input Sanitization, and Prompt Injection Defense.
 */

// In-memory rate limiter per IP / User
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, limit: number = 30, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

// Prompt Injection Sanitizer: strips common jailbreak markers and delimiter manipulation
export function sanitizePromptInput(input: string, maxLength: number = 2000): string {
  if (!input) return '';
  let cleaned = input.trim().slice(0, maxLength);

  // Strip system prompt injection markers and role-spoofing markers
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /disregard all previous/gi,
    /you are now in developer mode/gi,
    /system\s*:\s*/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
  ];

  for (const pattern of injectionPatterns) {
    cleaned = cleaned.replace(pattern, '[filtered]');
  }

  return cleaned;
}

// Sanitize HTML to prevent stored XSS
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
