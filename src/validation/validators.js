export function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value = "") {
  const digits = value.replace(/\D/g, "");

  return digits.length >= 10 && digits.length <= 15;
}

export function isValidZipCode(value = "") {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}
