import { describe, expect, it } from 'vitest';
import { normalizeDatex } from './normalize.js';
import { buildApp } from '../app.js';
import { createMemoryStore } from '../store.js';

// Fixture simplifiée écrite à la main (structure DATEX II). À remplacer par un vrai flux enregistré.
const xml = `<?xml version="1.0"?>
<d2LogicalModel xmlns="http://datex2.eu/schema/2/2_0">
 <payloadPublication>
  <situation id="S1">
   <overallSeverity>high</overallSeverity>
   <situationRecord id="R1" type="Accident">
    <situationRecordCreationTime>2026-10-27T08:00:00Z</situationRecordCreationTime>
    <validity><validityTimeSpecification><overallStartTime>2026-10-27T08:00:00Z</overallStartTime></validityTimeSpecification></validity>
    <generalPublicComment><comment><values><value>Accident sur l'A10</value></values></comment></generalPublicComment>
    <groupOfLocations><locationForDisplay><latitude>47.9</latitude><longitude>1.9</longitude><roadNumber>A10</roadNumber></locationForDisplay></groupOfLocations>
   </situationRecord>
  </situation>
  <situation id="S2">
   <situationRecord id="R2" type="MaintenanceWorks">
    <situationRecordCreationTime>2026-10-27T08:00:00Z</situationRecordCreationTime>
    <groupOfLocations><locationForDisplay><latitude>43.3</latitude><longitude>5.4</longitude></locationForDisplay></groupOfLocations>
   </situationRecord>
  </situation>
 </payloadPublication>
</d2LogicalModel>`;

describe('normalizeDatex', () => {
  it('garde les incidents du Loiret et ignore les autres', () => {
    const items = normalizeDatex(xml);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: 'bison-fute:R1', type: 'accident', severity: 'high', road: 'A10', source: 'bison-fute' });
  });

  it('retourne une liste vide pour un flux vide', () => {
    expect(normalizeDatex('<d2LogicalModel/>')).toEqual([]);
  });
});

describe('GET /incidents', () => {
  it('renvoie les incidents du store', async () => {
    const store = createMemoryStore();
    store.upsertMany(normalizeDatex(xml));
    const res = await buildApp(store).inject({ method: 'GET', url: '/incidents?type=accident' });
    expect(res.statusCode).toBe(200);
    expect(res.json().items).toHaveLength(1);
  });
});
