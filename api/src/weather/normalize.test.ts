import { describe, expect, it } from 'vitest';
import { IncidentSchema } from '../incident.js';
import { normalizeVigicrues, normalizeVigilance } from './normalize.js';

const now = '2026-10-27T09:00:00.000Z';

describe('normalizeVigilance', () => {
  it('garde le Loiret en jaune ou plus et produit des Incident valides', () => {
    const out = normalizeVigilance(
      [
        { domain: '45', phenomenon: 'Orages', colorId: 3, beginsAt: '2026-10-27T12:00:00.000Z' },
        { domain: '45', phenomenon: 'Vent', colorId: 1, beginsAt: '2026-10-27T12:00:00.000Z' },
        { domain: '37', phenomenon: 'Orages', colorId: 4, beginsAt: '2026-10-27T12:00:00.000Z' },
      ],
      now,
    );
    expect(out).toHaveLength(1);
    expect(out[0].severity).toBe('medium');
    expect(IncidentSchema.safeParse(out[0]).success).toBe(true);
  });
});

describe('normalizeVigicrues', () => {
  it('ignore le vert et les autres départements, rouge = high', () => {
    const base = { name: 'La Loire à Orléans', lat: 47.9, lon: 1.9, updatedAt: '2026-10-27T08:00:00.000Z' };
    const out = normalizeVigicrues(
      [
        { ...base, id: 'A', level: 'rouge', departement: '45' },
        { ...base, id: 'B', level: 'vert', departement: '45' },
        { ...base, id: 'C', level: 'orange', departement: '41' },
      ],
      now,
    );
    expect(out).toHaveLength(1);
    expect(out[0].severity).toBe('high');
    expect(IncidentSchema.safeParse(out[0]).success).toBe(true);
  });
});
