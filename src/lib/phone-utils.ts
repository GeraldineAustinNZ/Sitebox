export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 0) {
    return '';
  }

  if (cleaned.startsWith('02')) {
    if (cleaned.length <= 3) {
      return cleaned;
    }
    if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  }

  if (cleaned.startsWith('0')) {
    if (cleaned.length <= 2) {
      return cleaned;
    }
    if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    }
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`;
  }

  return cleaned.slice(0, 10);
}

export function cleanPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidNZPhone(value: string): boolean {
  const cleaned = cleanPhoneNumber(value);

  if (cleaned.length < 9 || cleaned.length > 11) {
    return false;
  }

  if (!cleaned.startsWith('0')) {
    return false;
  }

  const validPrefixes = ['021', '022', '027', '020', '028', '029', '03', '04', '06', '07', '09'];

  return validPrefixes.some(prefix => cleaned.startsWith(prefix));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
