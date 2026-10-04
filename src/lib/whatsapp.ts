export const WHATSAPP_NUMBER = "393474867408";

const WHATSAPP_PREFILL_KEY = "kereztour-whatsapp-prefill-used";

export const whatsappUrl = (message?: string) => {
  const baseUrl = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;

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

  return `${baseUrl}&text=${encodeURIComponent(message)}`;
};

/**
 * Opens WhatsApp in a separate browser tab.
 * Using web.whatsapp.com directly avoids the api.whatsapp.com redirect
 * that can be blocked by embedded site previews.
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
