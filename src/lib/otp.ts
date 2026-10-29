// In-memory OTP storage (no database needed)
// Each OTP entry has: email, code, createdAt, attempts, verified
// Auto-expires after 10 minutes (can be re-sent after 1 hour if failed)

interface OtpEntry {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  lastFailedAt: number | null; // timestamp of last failed verification
}

// Map of email → OTP entry
const otpStore = new Map<string, OtpEntry>();

// OTP expires after 10 minutes
const OTP_TTL_MS = 10 * 60 * 1000;
// Retry cooldown after failed verification: 1 hour
const RETRY_COOLDOWN_MS = 60 * 60 * 1000;
// Max verification attempts per OTP
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  // 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOtp(email: string): { code: string; isNew: boolean } {
  const existing = otpStore.get(email);
  const now = Date.now();

  // Check if there's a failed OTP within the 1-hour cooldown
  if (existing && existing.lastFailedAt) {
    const timeSinceLastFail = now - existing.lastFailedAt;
    if (timeSinceLastFail < RETRY_COOLDOWN_MS) {
      const minutesLeft = Math.ceil((RETRY_COOLDOWN_MS - timeSinceLastFail) / (60 * 1000));
      throw new Error(`Please wait ${minutesLeft} minute(s) before requesting a new OTP.`);
    }
  }

  const code = generateOtp();
  const entry: OtpEntry = {
    email,
    code,
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    verified: false,
    lastFailedAt: null,
  };

  otpStore.set(email, entry);
  return { code, isNew: true };
}

export function verifyOtp(email: string, code: string): { success: boolean; reason?: string } {
  const entry = otpStore.get(email);
  const now = Date.now();

  if (!entry) {
    return { success: false, reason: "No OTP found. Please request a new one." };
  }

  // If already verified, success
  if (entry.verified) {
    return { success: true };
  }

  // Check expiry
  if (now > entry.expiresAt) {
    return { success: false, reason: "OTP expired. Please request a new one." };
  }

  // Check max attempts
  if (entry.attempts >= MAX_ATTEMPTS) {
    // Mark as failed — sets the 1-hour cooldown
    entry.lastFailedAt = now;
    otpStore.set(email, entry);
    return {
      success: false,
      reason: "Too many failed attempts. Please wait 1 hour before requesting a new OTP.",
    };
  }

  // Increment attempts
  entry.attempts += 1;

  // Check code
  if (entry.code !== code) {
    // Save the failed attempt
    otpStore.set(email, entry);

    const attemptsLeft = MAX_ATTEMPTS - entry.attempts;
    if (attemptsLeft <= 0) {
      // Last attempt — trigger 1-hour cooldown
      entry.lastFailedAt = now;
      otpStore.set(email, entry);
      return {
        success: false,
        reason: "Too many failed attempts. Please wait 1 hour before requesting a new OTP.",
      };
    }
    return {
      success: false,
      reason: `Wrong OTP. ${attemptsLeft} attempt(s) left.`,
    };
  }

  // Success
  entry.verified = true;
  otpStore.set(email, entry);
  return { success: true };
}

export function isOtpVerified(email: string): boolean {
  const entry = otpStore.get(email);
  if (!entry) return false;
  // Verified status is valid for 1 hour after verification
  if (entry.verified && Date.now() - entry.createdAt < 60 * 60 * 1000) {
    return true;
  }
  return false;
}

// Cleanup old entries every 10 minutes (run in background)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [email, entry] of otpStore.entries()) {
      // Remove entries older than 2 hours
      if (now - entry.createdAt > 2 * 60 * 60 * 1000) {
        otpStore.delete(email);
      }
    }
  }, 10 * 60 * 1000);
}
