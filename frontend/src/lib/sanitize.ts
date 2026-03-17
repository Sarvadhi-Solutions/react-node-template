import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'del',
  'h1', 'h2', 'h3',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'span',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'class',
  'data-type', 'data-id',
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/** Returns true when the HTML string contains no visible text content. */
export function isHtmlEmpty(html: string): boolean {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length === 0;
}

const HTML_TAG_RE = /<[a-z][\s\S]*>/i;

/** Detect whether a string contains HTML tags. */
export function isHtmlContent(value: string): boolean {
  return HTML_TAG_RE.test(value);
}

/** Convert plain text to minimal HTML by wrapping lines in <p> tags. */
export function plainTextToHtml(text: string): string {
  return text
    .split('\n')
    .map((line) => `<p>${line || '<br>'}</p>`)
    .join('');
}
