/**
 * Centralized regex patterns for consistent validation across the application.
 * Following Big Tech standards (Google, Shopify, Stripe input validation).
 */
export const REGEX = {
  /**
   * Auth
   * - Username: 3–50 chars, only letters/digits/underscore/dot, no leading dot/underscore
   * - Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit
   */
  USERNAME: /^(?![_.])[a-zA-Z0-9_.]{3,50}(?<![_.])$/,
  PASSWORD: /.{6,}/,

  /**
   * Product
   * - Code: 2–30 chars, uppercase letters/digits/dash/underscore (e.g. SP-001, SKU_99)
   * - Name: 2–200 chars, Unicode-safe (Vietnamese, letters, digits, spaces, basic punctuation)
   * - Note: up to 1000 chars, no control characters
   */
  PRODUCT_CODE: /^[A-Z0-9][A-Z0-9_\-().,.]{1,29}$/i,
  PRODUCT_NAME: /^[\p{L}\p{N}\s\-(),.'"]{2,200}$/u,
  NOTE: /^[\s\S]{0,1000}$/,

  /**
   * Common
   * - Integer: positive integers only
   * - Positive number: positive integers or decimals
   */
  POSITIVE_INTEGER: /^[1-9]\d*$/,
  NON_NEGATIVE_INTEGER: /^\d+$/,
} as const;
