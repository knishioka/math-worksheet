/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if addition will result in carry over
 */
export function hasCarryOver(a: number, b: number): boolean {
  const aStr = a.toString();
  const bStr = b.toString();
  const maxLen = Math.max(aStr.length, bStr.length);

  let carry = 0;
  for (let i = 0; i < maxLen; i++) {
    const digit1 = parseInt(aStr[aStr.length - 1 - i] || '0');
    const digit2 = parseInt(bStr[bStr.length - 1 - i] || '0');
    const sum = digit1 + digit2 + carry;
    if (sum >= 10) {
      return true;
    }
    carry = Math.floor(sum / 10);
  }

  return false;
}

/**
 * Check if subtraction will result in borrow
 */
export function hasBorrow(a: number, b: number): boolean {
  if (a < b) return false; // Invalid subtraction

  const aStr = a.toString();
  const bStr = b.toString();

  for (let i = 0; i < bStr.length; i++) {
    const digit1 = parseInt(aStr[aStr.length - 1 - i]);
    const digit2 = parseInt(bStr[bStr.length - 1 - i]);
    if (digit1 < digit2) {
      return true;
    }
  }

  return false;
}

/**
 * Generate a unique ID for problems
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
