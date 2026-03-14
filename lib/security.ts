/**
 * Security utilities for fraud detection and transaction verification
 */

export interface FraudScore {
  score: number; // 0-100
  risk: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  requiresApproval: boolean;
}

export interface TransactionContext {
  userId: string;
  accountId: string;
  amount: number;
  recipientAccountId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  previousTransactionTime?: Date;
  isNewBeneficiary?: boolean;
}

/**
 * Calculate fraud risk score for a transaction
 */
export function calculateFraudScore(context: TransactionContext): FraudScore {
  const flags: string[] = [];
  let score = 0;

  // Check for unusually large transaction
  if (context.amount > 10000) {
    flags.push('Large transaction amount');
    score += 25;
  }

  // Check for rapid consecutive transactions
  if (context.previousTransactionTime) {
    const timeDiff = context.timestamp.getTime() - context.previousTransactionTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    if (minutesDiff < 5) {
      flags.push('Rapid consecutive transactions');
      score += 20;
    }
  }

  // Check for new beneficiary
  if (context.isNewBeneficiary) {
    flags.push('Transfer to new beneficiary');
    score += 15;
  }

  // Check for unusual time
  const hour = context.timestamp.getHours();
  if (hour < 6 || hour > 23) {
    flags.push('Transaction during unusual hours');
    score += 10;
  }

  // Determine risk level
  let risk: FraudScore['risk'] = 'low';
  let requiresApproval = false;

  if (score >= 75) {
    risk = 'critical';
    requiresApproval = true;
  } else if (score >= 50) {
    risk = 'high';
    requiresApproval = true;
  } else if (score >= 25) {
    risk = 'medium';
  }

  return { score, risk, flags, requiresApproval };
}

/**
 * Validate transaction for security compliance
 */
export function validateTransactionSecurity(context: TransactionContext): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for negative or zero amount
  if (context.amount <= 0) {
    errors.push('Transaction amount must be positive');
  }

  // Check for unusual amount patterns
  if (context.amount > 999999) {
    errors.push('Transaction amount exceeds maximum limit');
  }

  // Check for account match
  if (context.recipientAccountId === context.accountId) {
    errors.push('Cannot transfer to the same account');
  }

  // Check for sufficient amount (basic check)
  if (context.amount > 1000000) {
    errors.push('Transaction exceeds daily limit');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate OTP for transaction verification
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Verify OTP
 */
export function verifyOTP(provided: string, actual: string, expiryMinutes: number = 5): boolean {
  // In production, also check expiry
  return provided === actual;
}

/**
 * Hash sensitive data (for audit logging)
 */
export function hashSensitiveData(data: string): string {
  // In production, use proper hashing (bcrypt, scrypt, etc)
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  return Array.from(encoded)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

/**
 * Mask account number for display
 */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length < 4) return '****';
  return `•••• •••• •••• ${accountNumber.slice(-4)}`;
}

/**
 * Mask email for display
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const masked = local.slice(0, 2) + '*'.repeat(Math.max(1, local.length - 2));
  return `${masked}@${domain}`;
}
