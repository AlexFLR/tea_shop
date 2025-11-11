const KEY = 'eur_to_ron';
const KEY_TS = 'eur_to_ron_ts';
const TTL_MS = 10 * 60 * 1000; // 10 minute

export async function getEurToRon() {
  try {
    const cached = localStorage.getItem(KEY);
    const ts = Number(localStorage.getItem(KEY_TS) || 0);
    if (cached && Date.now() - ts < TTL_MS) {
      return Number(cached);
    }
    const r = await fetch('http://localhost:4000/api/rate');
    if (!r.ok) throw new Error('rate failed');
    const data = await r.json();
    const rate = Number(data.eur_to_ron);
    if (Number.isFinite(rate)) {
      localStorage.setItem(KEY, String(rate));
      localStorage.setItem(KEY_TS, String(Date.now()));
      return rate;
    }
  } catch (_) {}
  // fallback: dacă nu merge nimic, întoarcem null
  return null;
}

export function eur(value, digits = 2) {
  return `€ ${Number(value).toFixed(digits)}`;
}

export function ron(value, digits = 2) {
  return `${Number(value).toFixed(digits)} RON`;
}
