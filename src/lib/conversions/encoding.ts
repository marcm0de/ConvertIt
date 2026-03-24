export type EncodingType = 'base64' | 'url' | 'html';

export function encodeValue(value: string, type: EncodingType): string {
  switch (type) {
    case 'base64':
      try { return btoa(unescape(encodeURIComponent(value))); } catch { return 'Invalid input'; }
    case 'url':
      return encodeURIComponent(value);
    case 'html':
      return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    default:
      return value;
  }
}

export function decodeValue(value: string, type: EncodingType): string {
  switch (type) {
    case 'base64':
      try { return decodeURIComponent(escape(atob(value))); } catch { return 'Invalid Base64'; }
    case 'url':
      try { return decodeURIComponent(value); } catch { return 'Invalid URL encoding'; }
    case 'html':
      const el = typeof document !== 'undefined' ? document.createElement('textarea') : null;
      if (el) { el.innerHTML = value; return el.value; }
      return value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    default:
      return value;
  }
}
