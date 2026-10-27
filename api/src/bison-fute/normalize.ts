import { XMLParser } from 'fast-xml-parser';
import { IncidentSchema, type Incident } from '../incident.js';

// Emprise approximative du Loiret (45). Filtre grossier, à affiner avec les limites communales.
export const LOIRET_BBOX = { minLat: 47.5, maxLat: 48.4, minLon: 1.5, maxLon: 3.2 };

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

const arr = <T>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

function mapType(recordType: string, cause?: string): Incident['type'] {
  if (/accident/i.test(recordType) || /accident/i.test(cause ?? '')) return 'accident';
  if (/maintenance|roadworks|construction/i.test(recordType)) return 'travaux';
  if (/weather|environmental/i.test(recordType)) return 'meteo';
  if (/traffic|congestion|abnormaltraffic/i.test(recordType)) return 'circulation';
  if (/obstruction|hazard|animal|vehicle/i.test(recordType)) return 'danger';
  return 'autre';
}

function mapSeverity(type: Incident['type'], raw?: string): Incident['severity'] {
  if (raw && /highest|high/i.test(raw)) return 'high';
  if (raw && /medium/i.test(raw)) return 'medium';
  if (type === 'accident') return 'high';
  if (type === 'travaux') return 'medium';
  return 'low';
}

const text = (v: unknown): string | undefined => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'object') return text((v as Record<string, unknown>)['#text'] ?? (v as Record<string, unknown>).value);
  return String(v);
};

/** Convertit un flux DATEX II (situationPublication) en incidents du Loiret. Les enregistrements invalides sont ignorés. */
export function normalizeDatex(xml: string): Incident[] {
  const doc = parser.parse(xml);
  const situations = arr(doc?.d2LogicalModel?.payloadPublication?.situation);
  const out: Incident[] = [];
  for (const s of situations) {
    for (const r of arr(s.situationRecord)) {
      const recordType = String(r['@_type'] ?? r['@_xsi:type'] ?? 'Unknown');
      const point = r.groupOfLocations?.locationForDisplay ?? r.groupOfLocations?.pointByCoordinates?.pointCoordinates;
      const lat = Number(text(point?.latitude));
      const lon = Number(text(point?.longitude));
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      if (lat < LOIRET_BBOX.minLat || lat > LOIRET_BBOX.maxLat || lon < LOIRET_BBOX.minLon || lon > LOIRET_BBOX.maxLon) continue;

      const type = mapType(recordType, text(r.cause?.causeDescription?.values?.value) ?? text(r.accidentType));
      const validity = r.validity?.validityTimeSpecification;
      const created = text(r.situationRecordCreationTime) ?? new Date().toISOString();
      const parsed = IncidentSchema.safeParse({
        id: `bison-fute:${String(r['@_id'] ?? s['@_id'])}`,
        type,
        severity: mapSeverity(type, text(s.overallSeverity)),
        source: 'bison-fute',
        verified: true,
        road: text(r.groupOfLocations?.locationForDisplay?.roadNumber) ?? text(r.groupOfLocations?.roadNumber),
        title: text(r.generalPublicComment?.comment?.values?.value) ?? recordType,
        description: text(r.generalPublicComment?.comment?.values?.value),
        lat,
        lon,
        startsAt: text(validity?.overallStartTime) ?? created,
        endsAt: text(validity?.overallEndTime),
        createdAt: created,
      });
      if (parsed.success) out.push(parsed.data);
    }
  }
  return out;
}
