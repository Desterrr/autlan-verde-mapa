import DOMPurify from 'dompurify';

// Configure DOMPurify for safe content rendering
const createSanitizer = () => {
  return {
    sanitize: (dirty: string) => {
      return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'],
        ALLOWED_ATTR: ['class'],
        KEEP_CONTENT: true,
      });
    }
  };
};

export const sanitizer = createSanitizer();

// Safe markdown-like parser with XSS protection
export const parseAndSanitizeContent = (content: string): string => {
  const lines = content.split('\n');
  const htmlLines = lines.map(line => {
    // Escape HTML entities first
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    if (escaped.startsWith('# ')) {
      return `<h1 class="text-3xl font-bold text-foreground mt-8 mb-4">${escaped.substring(2)}</h1>`;
    } else if (escaped.startsWith('## ')) {
      return `<h2 class="text-2xl font-semibold text-foreground mt-6 mb-3">${escaped.substring(3)}</h2>`;
    } else if (escaped.startsWith('### ')) {
      return `<h3 class="text-xl font-semibold text-foreground mt-4 mb-2">${escaped.substring(4)}</h3>`;
    } else if (escaped.startsWith('- ')) {
      return `<li class="text-muted-foreground mb-1">${escaped.substring(2)}</li>`;
    } else if (escaped.startsWith('**') && escaped.endsWith('**')) {
      return `<h4 class="font-semibold text-foreground mt-4 mb-2">${escaped.slice(2, -2)}</h4>`;
    } else if (escaped.trim() === '') {
      return '<br>';
    } else {
      return `<p class="text-muted-foreground mb-4 leading-relaxed">${escaped}</p>`;
    }
  });

  const html = htmlLines.join('');
  return sanitizer.sanitize(html);
};