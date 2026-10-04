export const WHATSAPP_NUMBER = "393474867408";

const WHATSAPP_PREFILL_KEY = "kereztour-whatsapp-prefill-used";

export const whatsappUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  if (!message) return baseUrl;

  try {
    if (window.localStorage.getItem(WHATSAPP_PREFILL_KEY) === "1") {
      return baseUrl;
    }
    window.localStorage.setItem(WHATSAPP_PREFILL_KEY, "1");
  } catch {
    // Use the normal prefilled link if browser storage is unavailable.
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
};
