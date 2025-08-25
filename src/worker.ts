import * as suppliers from './activities/suppliers';
import * as orch from './activities/orchestrator';
import { NativeConnection, Worker } from '@temporalio/worker';

export async function startWorker() {
  const connection = await NativeConnection.connect({
    // address: 'localhost:7233', // if running on host
    address: 'temporal:7233', // if inside docker-compose network
  });

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/hotelOrchestrator'),
    activities: { ...suppliers, ...orch },
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'hotel-orchestrator',
    connection,
  });

  console.log(`Worker started on ${worker.options.taskQueue}`);
  await worker.run();
}
