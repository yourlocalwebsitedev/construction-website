// Shared helpers for outbound contact links (WhatsApp, tel, sms).
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello K & L, I'd like to get an estimate for a plastering project.";

export function getWhatsAppUrl(whatsappNumber: string, message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  const digits = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getTelUrl(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}

export function getSmsUrl(phone: string): string {
  return `sms:${phone.replace(/[^0-9+]/g, '')}`;
}
