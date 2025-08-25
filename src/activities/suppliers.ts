export type SupplierHotel = {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
  supplier: 'Supplier A' | 'Supplier B';
};

// In-memory mock data generators so activities & HTTP endpoints share logic
const seedA: Record<string, SupplierHotel[]> = {
  delhi: [
    { hotelId: 'a1', name: 'Holtin', price: 6000, city: 'delhi', commissionPct: 10, supplier: 'Supplier A' },
    { hotelId: 'a2', name: 'Radison', price: 6200, city: 'delhi', commissionPct: 13, supplier: 'Supplier A' },
    { hotelId: 'a3', name: 'Taj Plaza', price: 9800, city: 'delhi', commissionPct: 12, supplier: 'Supplier A' },
  ],
  mumbai: [
    { hotelId: 'a4', name: 'Sea View', price: 7500, city: 'mumbai', commissionPct: 11, supplier: 'Supplier A' },
  ],
};

const seedB: Record<string, SupplierHotel[]> = {
  delhi: [
    { hotelId: 'b1', name: 'Holtin', price: 5340, city: 'delhi', commissionPct: 20, supplier: 'Supplier B' },
    { hotelId: 'b2', name: 'Radison', price: 5900, city: 'delhi', commissionPct: 13, supplier: 'Supplier B' },
    { hotelId: 'b3', name: 'Budget Inn', price: 3500, city: 'delhi', commissionPct: 9, supplier: 'Supplier B' },
  ],
  mumbai: [
    { hotelId: 'b4', name: 'Sea View', price: 7700, city: 'mumbai', commissionPct: 9, supplier: 'Supplier B' },
  ],
};

export async function getSupplierAHotels(city: string): Promise<SupplierHotel[]> {
  // Simulate latency
  await new Promise(r => setTimeout(r, 200));
  return (seedA[city.toLowerCase()] ?? []).map(h => ({ ...h }));
}

export async function getSupplierBHotels(city: string): Promise<SupplierHotel[]> {
  await new Promise(r => setTimeout(r, 150));
  return (seedB[city.toLowerCase()] ?? []).map(h => ({ ...h }));
}