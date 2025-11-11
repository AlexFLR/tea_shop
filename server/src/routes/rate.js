import { Router } from 'express';

const router = Router();

// cache simplu in memorie (10 minute)
let cache = { value: null, ts: 0 };
const TTL_MS = 10 * 60 * 1000;

router.get('/', async (_req, res) => {
  try {
    // dacă avem curs în cache și e proaspăt, îl servim
    if (cache.value && Date.now() - cache.ts < TTL_MS) {
      return res.json({ eur_to_ron: cache.value, source: 'cache' });
    }

    // Frankfurter (sursă publică cu rate ECB)
    const r = await fetch('https://api.frankfurter.app/latest?amount=1&from=EUR&to=RON');
    if (!r.ok) return res.status(502).json({ error: 'Rate API failed' });
    const data = await r.json();
    const eur_to_ron = data?.rates?.RON;
    if (!eur_to_ron) return res.status(502).json({ error: 'Rate missing' });

    cache = { value: eur_to_ron, ts: Date.now() };
    res.json({ eur_to_ron, source: 'live' });
  } catch (e) {
    res.status(500).json({ error: 'Rate fetch error' });
  }
});

export default router;
