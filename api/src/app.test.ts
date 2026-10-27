import { describe, it, expect } from 'vitest';
import { buildApp } from './app.js';
import { IncidentSchema } from './incident.js';

describe('GET /health', () => {
  it('retourne ok', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe('ok');
  });
});

describe('IncidentSchema', () => {
  const base = {
    id: 'x1',
    type: 'accident',
    severity: 'high',
    source: 'community',
    verified: false,
    title: 'Accident A10',
    lat: 47.9,
    lon: 1.9,
    startsAt: '2026-10-27T08:00:00Z',
    createdAt: '2026-10-27T08:00:00Z',
  };
  it('accepte un incident valide', () => {
    expect(IncidentSchema.safeParse(base).success).toBe(true);
  });
  it('refuse une latitude invalide', () => {
    expect(IncidentSchema.safeParse({ ...base, lat: 200 }).success).toBe(false);
  });
});
