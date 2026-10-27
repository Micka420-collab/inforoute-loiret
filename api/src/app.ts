import Fastify from 'fastify';
import { createMemoryStore, type IncidentStore } from './store.js';

export function buildApp(store: IncidentStore = createMemoryStore()) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  app.get('/health', async () => ({ status: 'ok', uptime: process.uptime() }));

  app.get<{ Querystring: { type?: string; road?: string } }>('/incidents', async (req) => ({
    items: store.list({ type: req.query.type, road: req.query.road }),
  }));

  return app;
}
