// International phone number rule used by the booking form.
// Accepts an optional "+" or "00" country prefix followed by 7-15 digits
// (first digit non-zero). Visual separators like spaces, dots or dashes are ignored.
export const isValidPhone = (value: string): boolean => {
  const normalized = value.replace(/[\s()./–-]/g, "");
  return /^(?:\+|00)?[1-9]\d{6,14}$/.test(normalized);
};
