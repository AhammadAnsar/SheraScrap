import DOMPurify from 'dompurify';

/**
 * Allowlist-based HTML sanitizer to prevent XSS, malicious scripts, and event handlers.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
        'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 'span',
        'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'img', 'div'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'width', 'height'
      ],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'data-*'],
    });
  }

  // Server-side fallback: strip script, iframe, onload, etc.
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '');
}
