import { buildApp } from './app.js';
import { createMemoryStore, startPolling } from './store.js';

const port = Number(process.env.PORT ?? 3000);
const store = createMemoryStore();
const app = buildApp(store);

if (process.env.BISON_FUTE_URL) {
  startPolling(store, process.env.BISON_FUTE_URL, Number(process.env.POLL_MS ?? 90_000), (m) => app.log.info(m));
} else {
  app.log.warn('BISON_FUTE_URL non défini: pas d\'ingestion');
}

app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
