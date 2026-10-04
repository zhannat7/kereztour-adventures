export const WHATSAPP_NUMBER = "393474867408";

const WHATSAPP_PREFILL_KEY = "kereztour-whatsapp-prefill-used";

export const whatsappUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  if (!message) return baseUrl;

  // WhatsApp can keep an existing draft. Only add the automatic
  // prefilled message once per browser so repeated clicks never append it.
  try {
    if (window.localStorage.getItem(WHATSAPP_PREFILL_KEY) === "1") {
      return baseUrl;
    }
    window.localStorage.setItem(WHATSAPP_PREFILL_KEY, "1");
  } catch {
    // Continue with the prefilled link if browser storage is unavailable.
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
};

/**
 * Open WhatsApp in a genuine top-level browser tab.
 * Creating the blank tab first prevents Lovable/preview iframes from
 * trying to render WhatsApp inside the embedded preview frame.
 */
export const openWhatsApp = (e: React.MouseEvent, message?: string) => {
  e.preventDefault();
  const url = whatsappUrl(message);
  const win = window.open("", "_blank");

  if (win) {
    win.opener = null;
    win.location.href = url;
    return;
  }

  // If the browser blocks a new tab, fall back to a top-level navigation.
  try {
    (window.top ?? window).location.href = url;
  } catch {
    window.location.href = url;
  }
};
