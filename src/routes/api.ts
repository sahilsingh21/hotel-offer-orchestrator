import { Router } from 'express';
import { z } from 'zod';
import { Connection, Client } from '@temporalio/client';

const router = Router();

const querySchema = z.object({
  city: z.string().min(1),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

router.get('/api/hotels', async (req, res) => {
  const parse = querySchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }
  const { city, minPrice, maxPrice } = parse.data;

  try {
    const taskQueue = process.env.TEMPORAL_TASK_QUEUE || 'hotel-orchestrator';
    const connection = await Connection.connect({ address: process.env.TEMPORAL_ADDRESS || 'temporal:7233' });
    const client = new Client({ connection });

    const result = await client.workflow.execute('hotelOfferWorkflow', {
      taskQueue,
      args: [{ city, minPrice, maxPrice }],
      workflowId: `wf-${city}-${Date.now()}`,
      followRuns: true,
    });

    res.json(result);
  } catch (err: any) {
    console.error('Workflow error', err);
    res.status(500).json({ error: 'Failed to orchestrate hotels', details: err?.message });
  }
});

router.get('/health', async (_req, res) => {
  // minimal health info; in real case we'd check connectivity
  const checks = {
    server: 'ok',
    temporalAddress: process.env.TEMPORAL_ADDRESS || 'temporal:7233',
    redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
    suppliers: {
      supplierA: 'ok',
      supplierB: 'ok',
    }
  };
  res.json(checks);
});

export default router;