export type Base = 'bin' | 'oct' | 'dec' | 'hex';

export const bases: { id: Base; label: string; radix: number }[] = [
  { id: 'bin', label: 'Binary', radix: 2 },
  { id: 'oct', label: 'Octal', radix: 8 },
  { id: 'dec', label: 'Decimal', radix: 10 },
  { id: 'hex', label: 'Hexadecimal', radix: 16 },
];

export function convertBase(value: string, fromBase: Base, toBase: Base): string {
  const from = bases.find(b => b.id === fromBase);
  const to = bases.find(b => b.id === toBase);
  if (!from || !to) return '';
  const decimal = parseInt(value, from.radix);
  if (isNaN(decimal)) return '';
  return decimal.toString(to.radix).toUpperCase();
}

export function toBitDisplay(value: string, fromBase: Base): string {
  const from = bases.find(b => b.id === fromBase);
  if (!from) return '';
  const decimal = parseInt(value, from.radix);
  if (isNaN(decimal) || decimal < 0) return '';
  const bits = decimal.toString(2);
  // Pad to multiple of 8
  const padded = bits.padStart(Math.ceil(bits.length / 8) * 8, '0');
  // Group by 4
  return padded.match(/.{4}/g)?.join(' ') || padded;
}
