export const WHATSAPP_NUMBER = "393474867408";

const WHATSAPP_PREFILL_KEY = "kereztour-whatsapp-prefill-used";

export const whatsappUrl = (message?: string) => {
  if (!message) return `https://wa.me/${WHATSAPP_NUMBER}`;

  // WhatsApp keeps the existing draft when the chat is opened again.
  // Re-sending the same ?text= parameter therefore appends the message
  // instead of replacing it. Only prefill it once per browser.
  try {
    if (window.localStorage.getItem(WHATSAPP_PREFILL_KEY) === "1") {
      return `https://wa.me/${WHATSAPP_NUMBER}`;
    }
    window.localStorage.setItem(WHATSAPP_PREFILL_KEY, "1");
  } catch {
    // If storage is unavailable, still provide the normal prefilled link.
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Opens WhatsApp reliably. Inside embedded previews/iframes a plain
 * target="_blank" navigation can be blocked, so we fall back to a
 * top-level navigation.
 */
export const openWhatsApp = (e: React.MouseEvent, message?: string) => {
  e.preventDefault();
  const url = whatsappUrl(message);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    try {
      (window.top ?? window).location.href = url;
    } catch {
      window.location.href = url;
    }
  }
};
