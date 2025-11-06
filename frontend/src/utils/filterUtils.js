// utils/filterUtils.js
export const slug = (s) =>
  (s ?? '').trim().toLowerCase().replace(/\s+/g, '-');

const ensureArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

// Accept both repeated keys and CSV in the URL
export const getMultiFromSearchParams = (sp, key) => {
  const items = ensureArray(sp.getAll(key)).flatMap((v) =>
    String(v)
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  );
  return [...new Set(items)]; // de-dup
};

export const toNum = (v) =>
  v != null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined;
