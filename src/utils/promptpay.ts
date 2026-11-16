/**
 * Standard PromptPay EMVCo QR Code Payload Generator (CRC16-CCITT)
 */

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i) & 0xff;
    crc ^= byte << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  const hex = (crc & 0xffff).toString(16).toUpperCase();
  return hex.padStart(4, '0');
}

function formatTag(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

export function cleanPromptPayId(raw: string): string {
  return raw.replace(/[^0-9]/g, '');
}

export function isValidPromptPayId(raw: string): boolean {
  const cleaned = cleanPromptPayId(raw);
  return cleaned.length === 10 || cleaned.length === 13;
}

export function generatePromptPayPayload(rawTarget: string, amount?: number): string {
  const cleaned = cleanPromptPayId(rawTarget);
  if (!cleaned) return '';

  let recipientTag = '';
  if (cleaned.length === 10) {
    // Thai Mobile: replace leading 0 with 0066
    const internationalPhone = '0066' + cleaned.substring(1);
    recipientTag = formatTag('01', internationalPhone);
  } else if (cleaned.length === 13) {
    // National ID
    recipientTag = formatTag('02', cleaned);
  } else {
    // Fallback if user entered something else
    recipientTag = formatTag('01', cleaned);
  }

  const aid = formatTag('00', 'A000000677010111');
  const merchantAccountInfo = formatTag('29', aid + recipientTag);

  let payload = '';
  payload += formatTag('00', '01'); // Payload Format Indicator
  payload += formatTag('01', amount && amount > 0 ? '12' : '11'); // Dynamic or Static
  payload += merchantAccountInfo;
  payload += formatTag('53', '764'); // Currency: THB
  payload += formatTag('58', 'TH');  // Country: Thailand

  if (amount !== undefined && amount > 0) {
    const formattedAmount = amount.toFixed(2);
    payload += formatTag('54', formattedAmount);
  }

  // Tag 63: Checksum header
  payload += '6304';
  const checksum = crc16(payload);
  return payload + checksum;
}
