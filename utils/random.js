/**
 * Generate alpha-numeric value
 * @param {number} length
 * @returns {string}
 */
export function alphaNumeric(length = 8) {
   const v = Array(length)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');

   return v;
}

/** Generate verification code */
export function verificationCode() {
   return Math.floor(Math.random() * 10e5);
}
