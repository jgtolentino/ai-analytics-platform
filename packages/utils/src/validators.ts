// Validators for Scout Analytics

/**
 * Validate email addresses
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Philippine phone numbers
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Philippine phone number patterns
  const patterns = [
    /^63\d{10}$/, // +63 format
    /^09\d{9}$/, // 09 format
    /^9\d{9}$/ // 9 format
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Validate currency amounts
 */
export function isValidCurrency(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0 && num < 1000000000; // Max 1B
}

/**
 * Validate percentage values
 */
export function isValidPercentage(value: number): boolean {
  return value >= 0 && value <= 100;
}

/**
 * Validate date ranges
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return startDate < endDate && startDate <= new Date();
}

/**
 * Validate SKU format
 */
export function isValidSKU(sku: string): boolean {
  // SKU should be 3-20 characters, alphanumeric with hyphens
  const skuRegex = /^[A-Z0-9-]{3,20}$/;
  return skuRegex.test(sku.toUpperCase());
}

/**
 * Validate environment variables
 */
export function isValidEnvVar(key: string, value: string): boolean {
  if (!key || !value) return false;
  
  // Check for common required env vars
  const requiredPatterns: { [key: string]: RegExp } = {
    SUPABASE_URL: /^https:\/\/\w+\.supabase\.co$/,
    SUPABASE_ANON_KEY: /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
    OPENAI_API_KEY: /^sk-[A-Za-z0-9]{20,}$/,
    VERCEL_TOKEN: /^[A-Za-z0-9]{24}$/
  };
  
  const pattern = requiredPatterns[key];
  return pattern ? pattern.test(value) : true;
}

/**
 * Validate confidence scores
 */
export function isValidConfidence(confidence: number): boolean {
  return confidence >= 0 && confidence <= 1;
}

/**
 * Validate file uploads
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate API responses
 */
export function isValidApiResponse(response: any): boolean {
  return response && typeof response === 'object' && response.status !== 'error';
}

/**
 * Validate chart data
 */
export function isValidChartData(data: any[]): boolean {
  return Array.isArray(data) && data.length > 0 && data.every(item => 
    typeof item === 'object' && item !== null
  );
}

/**
 * Validate color hex codes
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(color);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .trim();
}