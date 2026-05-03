// String utilities

export function normalizeSearchText(value: string) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function detectScriptFromText(text: string) {
  const sample = String(text || '').slice(0, 500);
  if (/[\u0400-\u04FF]/.test(sample)) return ' Cyrillic';
  if (/[\u0600-\u06FF]/.test(sample)) return 'Arabic';
  if (/[\u0590-\u05FF]/.test(sample)) return 'Hebrew';
  if (/[\u0900-\u097F]/.test(sample)) return 'Devanagari';
  if (/[\u4E00-\u9FFF]/.test(sample)) return 'Chinese';
  if (/[\u3040-\u309F]/.test(sample) || /[\u30A0-\u30FF]/.test(sample)) return 'Japanese';
  if (/[\uAC00-\uD7AF]/.test(sample)) return 'Korean';
  return null;
}

export function abbreviateSingleWord(word: string) {
  const w = String(word || '').trim();
  if (!w) return w;
  if (w.length <= 3) return w;
  if (w.length <= 5) return w.slice(0, 1) + '.';
  return w.slice(0, 2) + '.';
}

export function parsePort(value: string | number, fallback: number) {
  if (value == null) return fallback;
  const n = typeof value === 'number' ? value : parseInt(String(value), 10);
  return Number.isNaN(n) ? fallback : Math.max(1, Math.min(65535, n));
}

export function pickNumber<T>(value: T | null | undefined, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === 'number') return value as T;
  if (typeof value === 'string') {
    const n = parseFloat(value);
    return Number.isNaN(n) ? fallback : n as T;
  }
  return fallback;
}

export function sanitizeBibleRefEntries(entries: unknown[], maxCount: number) {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter(entry => entry && typeof entry === 'object' && typeof (entry as { query?: string }).query === 'string')
    .slice(0, maxCount || 20);
}

export function normalizeLtPresetValues(values: Record<string, unknown>, target: string) {
  return {
    scalePct: 100,
    ...values,
    ltFontSongs: values.ltFontSongs ?? (target === 'songs' ? 30 : undefined),
    ltFontBible: values.ltFontBible ?? (target === 'bible' ? 33 : undefined)
  };
}