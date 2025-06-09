import { describe, it, expect } from 'vitest';
import { randomInt, hasCarryOver, hasBorrow, generateId } from './math';

describe('randomInt', () => {
  it('should generate number within range', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  it('should return the same number when min equals max', () => {
    expect(randomInt(5, 5)).toBe(5);
  });
});

describe('hasCarryOver', () => {
  it('should detect carry over in addition', () => {
    expect(hasCarryOver(9, 7)).toBe(true); // 9 + 7 = 16
    expect(hasCarryOver(15, 8)).toBe(true); // 15 + 8 = 23
    expect(hasCarryOver(99, 1)).toBe(true); // 99 + 1 = 100
  });

  it('should detect no carry over', () => {
    expect(hasCarryOver(2, 3)).toBe(false); // 2 + 3 = 5
    expect(hasCarryOver(11, 8)).toBe(false); // 11 + 8 = 19
    expect(hasCarryOver(20, 30)).toBe(false); // 20 + 30 = 50
  });
});

describe('hasBorrow', () => {
  it('should detect borrow in subtraction', () => {
    expect(hasBorrow(20, 8)).toBe(true); // 20 - 8, needs borrow
    expect(hasBorrow(100, 99)).toBe(true); // 100 - 99, needs borrow
  });

  it('should detect no borrow needed', () => {
    expect(hasBorrow(25, 13)).toBe(false); // 25 - 13, no borrow
    expect(hasBorrow(99, 11)).toBe(false); // 99 - 11, no borrow
  });

  it('should return false for invalid subtraction', () => {
    expect(hasBorrow(5, 10)).toBe(false); // 5 - 10 is invalid
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });

  it('should generate IDs in expected format', () => {
    const id = generateId();
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);
  });
});