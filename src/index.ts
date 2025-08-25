import { startServer } from './server';
import { startWorker } from './worker';

// Start HTTP server
startServer();

// Start Temporal worker (async, non-blocking)
startWorker().catch((err) => {
  console.error('Worker failed:', err);
  process.exit(1);
});