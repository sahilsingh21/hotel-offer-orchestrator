import { saveHotelsSortedByPrice, filterHotelsByPrice } from '../lib/redis';
import type { SupplierHotel } from './suppliers';

export type PublicHotel = {
  name: string;
  price: number;
  supplier: 'Supplier A' | 'Supplier B';
  commissionPct: number;
};

export async function dedupeAndPickBest(a: SupplierHotel[], b: SupplierHotel[]): Promise<PublicHotel[]> {
  const byName: Record<string, PublicHotel> = {};

  const consider = (h: SupplierHotel) => {
    const key = h.name.toLowerCase();
    const candidate: PublicHotel = { name: h.name, price: h.price, supplier: h.supplier, commissionPct: h.commissionPct };
    if (!(key in byName) || candidate.price < byName[key].price) {
      byName[key] = candidate;
    }
  };

  [...a, ...b].forEach(consider);

  return Object.values(byName).sort((x, y) => x.price - y.price);
}

export async function cacheHotels(city: string, hotels: PublicHotel[]) {
  await saveHotelsSortedByPrice(city, hotels);
}

export async function filterFromCache(city: string, min?: number, max?: number) {
  return await filterHotelsByPrice(city, min, max);
}