export const WHATSAPP_NUMBER = "393474867408";

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

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
