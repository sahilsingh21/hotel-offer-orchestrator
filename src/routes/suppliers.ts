import { Router } from 'express';
import { getSupplierAHotels, getSupplierBHotels } from '../activities/suppliers';

const router = Router();

router.get('/supplierA/hotels', async (req, res) => {
  const city = (req.query.city as string) || 'delhi';
  const data = await getSupplierAHotels(city);
  res.json(data);
});

router.get('/supplierB/hotels', async (req, res) => {
  const city = (req.query.city as string) || 'delhi';
  const data = await getSupplierBHotels(city);
  res.json(data);
});

export default router;