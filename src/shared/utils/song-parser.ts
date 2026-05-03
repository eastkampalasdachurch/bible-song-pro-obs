// Song parsing utilities

export function parseSongVerseHeader(line: string, allowLoose = false) {
  const raw = String(line || '').trim();
  if (!raw) return null;
  let match = raw.match(/^(\d{1,3})\s*[:.,]\s*(.*)$/);
  if (match) {
    return { number: match[1], text: (match[2] || '').trim() };
  }
  match = raw.match(/^(\d{1,3})\s*$/);
  if (match) {
    return { number: match[1], text: '' };
  }
  if (allowLoose) {
    match = raw.match(/^(\d{1,3})\s+(.+)$/);
    if (match) {
      return { number: match[1], text: (match[2] || '').trim() };
    }
  }
  return null;
}

export function normalizeSongLyricsLineBreaks(text: string) {
  return String(text || '').replace(/\r\n?/g, '\n');
}

export function parseNamedSongSectionHeader(line: string) {
  const raw = String(line || '').trim();
  if (!raw) return null;
  const match = raw.match(/^(verse|chorus|bridge|refrain|pre[-\s]?chorus|intro|outro|tag|hook)(?:\s+(\d{1,3}|[ivxlcdm]+))?\s*[:.\-]?\s*(.*)$/i);
  if (!match) return null;
  const kind = match[1].replace(/\s+/g, ' ').replace(/^pre[-\s]?chorus$/i, 'Pre-Chorus');
  const number = (match[2] || '').trim();
  const text = (match[3] || '').trim();
  const prettyKind = kind
    .split(/[\s-]+/)
    .map(part => part ? (part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) : '')
    .join(kind.includes('-') ? '-' : ' ');
  return {
    label: `${prettyKind}${number ? ' ' + number.toUpperCase() : ''}`.trim(),
    text
  };
}

export function splitSongSectionLines(lines: string[], maxLines = 6) {
  const clean = (Array.isArray(lines) ? lines : []).map(line => String(line || '').trim()).filter(Boolean);
  if (!clean.length) return [];
  const limit = Math.max(1, Number(maxLines) || 6);
  const partCount = Math.max(1, Math.ceil(clean.length / limit));
  const chunks: string[][] = [];
  let offset = 0;
  for (let i = 0; i < partCount; i += 1) {
    const remainingLines = clean.length - offset;
    const remainingParts = partCount - i;
    const size = Math.ceil(remainingLines / remainingParts);
    chunks.push(clean.slice(offset, offset + size));
    offset += size;
  }
  return chunks.filter(chunk => chunk.length);
}

export function inferSectionedLyricsFromText(text: string) {
  const lines = normalizeSongLyricsLineBreaks(text).split('\n');
  const result: string[] = [];
  let currentSection: string[] = [];
  let lastWasBlank = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const isBlank = !String(line || '').trim();
    if (isBlank && !lastWasBlank && currentSection.length > 0) {
      result.push(...currentSection, '');
      currentSection = [];
    } else if (!isBlank) {
      currentSection.push(line);
    }
    lastWasBlank = isBlank;
  }
  if (currentSection.length > 0) {
    result.push(...currentSection);
  }
  return result.join('\n');
}

export function normalizeSongBlockKey(text: string) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

export function hashTextFast(value: string) {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return String(hash);
}

export function getBibleItemKey(item: { title?: string; book?: string; chapter?: string }) {
  if (!item) return '';
  if (item.book && item.chapter != null) {
    return `${item.book} ${item.chapter}`;
  }
  return item.title || '';
}

export function getFirstVerseNumber(raw: string) {
  const lines = String(raw || '').split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^(\d+)/);
    if (match) return match[1];
  }
  return null;
}

export function matchesVerseStart(raw: string, verseNum: string) {
  const lines = String(raw || '').split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^(\d+)/);
    if (match && match[1] === verseNum) return true;
  }
  return false;
}