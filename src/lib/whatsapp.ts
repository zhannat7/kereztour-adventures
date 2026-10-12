export const WHATSAPP_NUMBER = "393474867408";

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/**
 * Opens WhatsApp in the current tab.
 * On mobile Safari, window.open can leave an empty about:blank tab behind
 * when the visitor returns from WhatsApp. Same-tab navigation avoids that.
 */
export const openWhatsApp = (e: React.MouseEvent, message?: string) => {
  e.preventDefault();
  window.location.assign(whatsappUrl(message));
};
