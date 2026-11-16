import { describe, it, expect } from 'vitest';
import { generatePromptPayPayload, isValidPromptPayId, cleanPromptPayId } from './promptpay';

describe('promptpay utilities', () => {
  it('cleans non-numeric characters from promptpay id', () => {
    expect(cleanPromptPayId('081-234-5678')).toBe('0812345678');
  });

  it('validates Thai mobile numbers and citizen IDs', () => {
    expect(isValidPromptPayId('0812345678')).toBe(true);
    expect(isValidPromptPayId('081-234-5678')).toBe(true);
    expect(isValidPromptPayId('1234567890123')).toBe(true);
    expect(isValidPromptPayId('1-2345-67890-12-3')).toBe(true);
    expect(isValidPromptPayId('12345')).toBe(false);
  });

  it('generates valid EMVCo PromptPay QR payload for mobile number', () => {
    const payload = generatePromptPayPayload('0812345678', 150);
    expect(payload.startsWith('000201')).toBe(true);
    expect(payload).toContain('0016A000000677010111');
    expect(payload).toContain('01130066812345678');
    expect(payload).toContain('5303764'); // THB
    expect(payload).toContain('5406150.00'); // Amount 150.00
    expect(payload).toContain('5802TH');
    expect(payload).toContain('6304');
    expect(payload.length).toBeGreaterThan(60);
  });

  it('generates open payload when amount is not provided', () => {
    const payload = generatePromptPayPayload('0812345678');
    expect(payload.startsWith('000201')).toBe(true);
    expect(payload).not.toContain('5406'); // No amount tag
  });
});
