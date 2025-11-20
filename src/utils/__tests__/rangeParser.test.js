/**
 * Unit tests for Range Parser utility
 * Tests reference range parsing and status detection
 */

import { describe, test, expect } from 'vitest';
import { 
  parseRange, 
  checkRangeStatus, 
  getStatusColor, 
  getStatusBgColor, 
  shouldBeBold 
} from '../rangeParser';

describe('parseRange', () => {
  test('parses standard range format', () => {
    const range = parseRange('7.94 - 20.07');
    expect(range).toEqual({
      type: 'range',
      min: 7.94,
      max: 20.07,
      text: '7.94 - 20.07'
    });
  });

  test('parses compact range without spaces', () => {
    const range = parseRange('0.72-1.18');
    expect(range).toEqual({
      type: 'range',
      min: 0.72,
      max: 1.18,
      text: '0.72-1.18'
    });
  });

  test('parses less-than format', () => {
    const range = parseRange('< 40');
    expect(range.type).toBe('lt');
    expect(range.max).toBe(40);
    expect(range.value).toBe(40);
  });

  test('parses greater-than format', () => {
    const range = parseRange('> 100');
    expect(range.type).toBe('gt');
    expect(range.min).toBe(100);
    expect(range.value).toBe(100);
  });

  test('parses range with units', () => {
    const range = parseRange('70 - 100 mg/dL');
    expect(range.type).toBe('range');
    expect(range.min).toBe(70);
    expect(range.max).toBe(100);
  });

  test('handles multiline bio reference', () => {
    const range = parseRange('Adult: 13 - 17 g/dL\nChild: 11 - 15 g/dL');
    expect(range.type).toBe('range');
    expect(range.min).toBe(13);
    expect(range.max).toBe(17);
  });

  test('returns null for invalid range', () => {
    const range = parseRange('Negative');
    expect(range).toBeNull();
  });

  test('returns null for empty string', () => {
    const range = parseRange('');
    expect(range).toBeNull();
  });
});

describe('checkRangeStatus', () => {
  test('detects HIGH status for standard range', () => {
    const range = { type: 'range', min: 7.94, max: 20.07 };
    expect(checkRangeStatus(25.5, range)).toBe('HIGH');
  });

  test('detects LOW status for standard range', () => {
    const range = { type: 'range', min: 7.94, max: 20.07 };
    expect(checkRangeStatus(5.0, range)).toBe('LOW');
  });

  test('detects BOUNDARY status at minimum', () => {
    const range = { type: 'range', min: 7.94, max: 20.07 };
    expect(checkRangeStatus(7.94, range)).toBe('BOUNDARY');
  });

  test('detects BOUNDARY status at maximum', () => {
    const range = { type: 'range', min: 7.94, max: 20.07 };
    expect(checkRangeStatus(20.07, range)).toBe('BOUNDARY');
  });

  test('detects NORMAL status within range', () => {
    const range = { type: 'range', min: 7.94, max: 20.07 };
    expect(checkRangeStatus(12.5, range)).toBe('NORMAL');
  });

  test('detects HIGH for less-than range', () => {
    const range = { type: 'lt', value: 40, max: 40 };
    expect(checkRangeStatus(125, range)).toBe('HIGH');
  });

  test('detects NORMAL for less-than range', () => {
    const range = { type: 'lt', value: 40, max: 40 };
    expect(checkRangeStatus(35, range)).toBe('NORMAL');
  });

  test('detects LOW for greater-than range', () => {
    const range = { type: 'gt', value: 100, min: 100 };
    expect(checkRangeStatus(85, range)).toBe('LOW');
  });

  test('returns NORMAL for non-numeric value', () => {
    const range = { type: 'range', min: 7.94, max: 20.07 };
    expect(checkRangeStatus('Trace', range)).toBe('NORMAL');
  });

  test('returns NORMAL for null range', () => {
    expect(checkRangeStatus(25.5, null)).toBe('NORMAL');
  });
});

describe('getStatusColor', () => {
  test('returns red for HIGH status', () => {
    expect(getStatusColor('HIGH')).toEqual([176, 0, 32]);
  });

  test('returns blue for LOW status', () => {
    expect(getStatusColor('LOW')).toEqual([29, 78, 216]);
  });

  test('returns orange for BOUNDARY status', () => {
    expect(getStatusColor('BOUNDARY')).toEqual([234, 88, 12]);
  });

  test('returns black for NORMAL status', () => {
    expect(getStatusColor('NORMAL')).toEqual([17, 17, 17]);
  });
});

describe('getStatusBgColor', () => {
  test('returns light red for HIGH status', () => {
    expect(getStatusBgColor('HIGH')).toEqual([254, 242, 242]);
  });

  test('returns light blue for LOW status', () => {
    expect(getStatusBgColor('LOW')).toEqual([239, 246, 255]);
  });

  test('returns light orange for BOUNDARY status', () => {
    expect(getStatusBgColor('BOUNDARY')).toEqual([255, 247, 237]);
  });

  test('returns null for NORMAL status', () => {
    expect(getStatusBgColor('NORMAL')).toBeNull();
  });
});

describe('shouldBeBold', () => {
  test('returns true for HIGH status', () => {
    expect(shouldBeBold('HIGH')).toBe(true);
  });

  test('returns true for LOW status', () => {
    expect(shouldBeBold('LOW')).toBe(true);
  });

  test('returns true for BOUNDARY status', () => {
    expect(shouldBeBold('BOUNDARY')).toBe(true);
  });

  test('returns false for NORMAL status', () => {
    expect(shouldBeBold('NORMAL')).toBe(false);
  });
});

describe('Edge cases', () => {
  test('handles decimal values correctly', () => {
    const range = parseRange('0.5 - 1.5');
    expect(checkRangeStatus(0.75, range)).toBe('NORMAL');
    expect(checkRangeStatus(1.8, range)).toBe('HIGH');
  });

  test('handles large numbers', () => {
    const range = parseRange('150000 - 400000');
    expect(range.min).toBe(150000);
    expect(range.max).toBe(400000);
  });

  test('handles en-dash and em-dash', () => {
    const rangeDash = parseRange('7.94 – 20.07'); // en-dash
    expect(rangeDash.min).toBe(7.94);
    
    const rangeEmDash = parseRange('7.94 — 20.07'); // em-dash
    expect(rangeEmDash.min).toBe(7.94);
  });

  test('handles extra whitespace', () => {
    const range = parseRange('  7.94   -   20.07  ');
    expect(range.min).toBe(7.94);
    expect(range.max).toBe(20.07);
  });

  test('handles string numbers', () => {
    const range = { type: 'range', min: 7.94, max: 20.07 };
    expect(checkRangeStatus('25.5', range)).toBe('HIGH');
  });
});
