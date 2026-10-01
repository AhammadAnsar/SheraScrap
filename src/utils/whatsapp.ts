export function whatsappUrl(number: string, message = '') {
  const digits = number.replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(digits)) throw new Error('Invalid WhatsApp contact number');
  return `https://wa.me/${digits}${message ? '?text=' + encodeURIComponent(message) : ''}`;
}
