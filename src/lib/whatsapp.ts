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
  // Note: "noopener" makes window.open return null, so we clear opener manually.
  const win = window.open(url, "_blank");
  if (win) {
    try { win.opener = null; } catch { /* ignore */ }
    return;
  }
  // Popup blocked: never navigate inside an embedded frame (WhatsApp refuses framing).
  if (window.self === window.top) window.location.href = url;
};
