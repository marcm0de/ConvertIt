export const currencies = [
  { id: 'USD', label: 'US Dollar', symbol: '$' },
  { id: 'EUR', label: 'Euro', symbol: '€' },
  { id: 'GBP', label: 'British Pound', symbol: '£' },
  { id: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { id: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { id: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { id: 'CHF', label: 'Swiss Franc', symbol: 'Fr' },
  { id: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
  { id: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { id: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
];

// Mock rates (relative to USD)
export const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  BRL: 4.97,
};

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromRate = mockRates[from];
  const toRate = mockRates[to];
  if (!fromRate || !toRate) return 0;
  // Convert to USD first, then to target
  const usd = amount / fromRate;
  return usd * toRate;
}
