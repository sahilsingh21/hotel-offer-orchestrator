import { proxyActivities } from '@temporalio/workflow';

const { getSupplierAHotels, getSupplierBHotels } = proxyActivities<{
  getSupplierAHotels(city: string): Promise<any[]>;
  getSupplierBHotels(city: string): Promise<any[]>;
}>({
  startToCloseTimeout: '20 seconds',
});

const { dedupeAndPickBest, cacheHotels, filterFromCache } = proxyActivities<{
  dedupeAndPickBest(a: any[], b: any[]): Promise<any[]>;
  cacheHotels(city: string, hotels: any[]): Promise<void>;
  filterFromCache(city: string, min?: number, max?: number): Promise<any[]>;
}>({
  startToCloseTimeout: '30 seconds',
});

export async function hotelOfferWorkflow(input: { city: string; minPrice?: number; maxPrice?: number }) {
  const city = input.city.toLowerCase();
  const [a, b] = await Promise.all([
    getSupplierAHotels(city),
    getSupplierBHotels(city),
  ]);

  const best = await dedupeAndPickBest(a, b);
  await cacheHotels(city, best);

  if (typeof input.minPrice === 'number' || typeof input.maxPrice === 'number') {
    return await filterFromCache(city, input.minPrice, input.maxPrice);
  }
  return best;
}