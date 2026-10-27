export const WHATSAPP_NUMBER = "393474867408";

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/**
 * Opens WhatsApp in a new tab so the Kereztour page stays open.
 * Falls back to same-tab navigation only if the popup is blocked.
 */
export const openWhatsApp = (e: React.MouseEvent, message?: string) => {
  e.preventDefault();
  const url = whatsappUrl(message);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win && window.self === window.top) {
    // noopener makes window.open return null even on success in some browsers,
    // so only navigate if no new window could be opened at all.
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  }
};
