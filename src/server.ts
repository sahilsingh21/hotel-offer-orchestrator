import express from 'express';
import suppliersRoutes from './routes/suppliers';
import apiRoutes from './routes/api';

export function startServer() {
  const app = express();
  app.use(express.json());

  app.use(suppliersRoutes);
  app.use(apiRoutes);

  const port = parseInt(process.env.PORT || '3000', 10);
  app.listen(port, () => {
    console.log(`[HTTP] Server listening on port ${port}`);
  });
}