import type { Incident } from './incident.js';
import { normalizeDatex } from './bison-fute/normalize.js';

/** Interface de stockage. Implémentation mémoire pour l'instant, Postgres ensuite (même interface). */
export interface IncidentStore {
  upsertMany(items: Incident[]): void;
  list(filter?: { type?: string; road?: string }): Incident[];
}

export function createMemoryStore(): IncidentStore {
  const map = new Map<string, Incident>();
  return {
    upsertMany(items) {
      for (const i of items) map.set(i.id, i);
    },
    list(filter = {}) {
      return [...map.values()]
        .filter((i) => (!filter.type || i.type === filter.type) && (!filter.road || i.road === filter.road))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  };
}

/** Récupère le flux DATEX II et alimente le store. L'URL vient de BISON_FUTE_URL (accès/licence à confirmer). */
export async function pollBisonFute(store: IncidentStore, url: string, fetchFn: typeof fetch = fetch): Promise<number> {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Bison Futé: HTTP ${res.status}`);
  const items = normalizeDatex(await res.text());
  store.upsertMany(items);
  return items.length;
}

export function startPolling(store: IncidentStore, url: string, everyMs = 90_000, log: (m: string) => void = console.log) {
  const run = () => pollBisonFute(store, url).then((n) => log(`bison-fute: ${n} incidents`), (e) => log(String(e)));
  void run();
  return setInterval(run, everyMs);
}
