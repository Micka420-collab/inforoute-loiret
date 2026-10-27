import type { Incident } from '../incident.js';

// Centre approximatif du Loiret (Orléans), utilisé faute de géométrie précise. À affiner.
const LOIRET_CENTER = { lat: 47.9, lon: 1.9 };

/** Forme simplifiée d'une vigilance Météo-France pour un département. À valider sur le vrai flux. */
export interface VigilanceEntry {
  domain: string; // numéro de département, ex: "45"
  phenomenon: string; // ex: "Orages", "Pluie-inondation"
  colorId: 1 | 2 | 3 | 4; // 1 vert, 2 jaune, 3 orange, 4 rouge
  beginsAt: string;
  endsAt?: string;
}

/** Forme simplifiée d'une station/tronçon Vigicrues. À valider sur le vrai flux. */
export interface VigicruesEntry {
  id: string;
  name: string; // ex: "La Loire à Orléans"
  level: 'vert' | 'jaune' | 'orange' | 'rouge';
  lat: number;
  lon: number;
  updatedAt: string;
  departement: string;
}

const severityOfColor = (c: number): Incident['severity'] => (c >= 4 ? 'high' : c === 3 ? 'medium' : 'low');

export function normalizeVigilance(entries: VigilanceEntry[], now = new Date().toISOString()): Incident[] {
  return entries
    .filter((e) => e.domain === '45' && e.colorId >= 2)
    .map((e) => ({
      id: `meteo-france:45:${e.phenomenon}:${e.beginsAt}`,
      type: 'meteo' as const,
      severity: severityOfColor(e.colorId),
      source: 'meteo-france' as const,
      verified: true,
      title: `Vigilance ${['', 'verte', 'jaune', 'orange', 'rouge'][e.colorId]} : ${e.phenomenon}`,
      lat: LOIRET_CENTER.lat,
      lon: LOIRET_CENTER.lon,
      startsAt: e.beginsAt,
      endsAt: e.endsAt,
      createdAt: now,
    }));
}

export function normalizeVigicrues(entries: VigicruesEntry[], now = new Date().toISOString()): Incident[] {
  const sev = { vert: 0, jaune: 1, orange: 2, rouge: 3 } as const;
  return entries
    .filter((e) => e.departement === '45' && sev[e.level] >= 1)
    .map((e) => ({
      id: `vigicrues:${e.id}:${e.level}`,
      type: 'meteo' as const,
      severity: sev[e.level] === 3 ? ('high' as const) : sev[e.level] === 2 ? ('medium' as const) : ('low' as const),
      source: 'vigicrues' as const,
      verified: true,
      title: `Crue (${e.level}) : ${e.name}`,
      lat: e.lat,
      lon: e.lon,
      startsAt: e.updatedAt,
      createdAt: now,
    }));
}

/** Récupère un flux JSON déjà mappé vers la forme simplifiée et alimente le store. */
export async function pollJson<T>(
  url: string,
  map: (raw: unknown) => T[],
  normalize: (items: T[]) => Incident[],
  upsert: (items: Incident[]) => void,
  fetchFn: typeof fetch = fetch,
): Promise<number> {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const items = normalize(map(await res.json()));
  upsert(items);
  return items.length;
}
