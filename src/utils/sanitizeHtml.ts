import sanitize from 'sanitize-html';
export function sanitizeHtml(html: string): string {
  return sanitize(html || '', {
    allowedTags: ['h1','h2','h3','h4','h5','h6','p','br','hr','ul','ol','li','strong','b','em','i','u','span','blockquote','table','thead','tbody','tr','th','td','a','img','div'],
    allowedAttributes: { '*': ['class'], a: ['href','title','target','rel'], img: ['src','alt','title','width','height','loading'] },
    allowedSchemes: ['http','https','mailto','tel'], allowProtocolRelative: false,
    transformTags: { a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, ...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}) } }) },
  });
}
