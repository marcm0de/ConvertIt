// Unit conversion data — all values relative to a base unit per category

export interface UnitCategory {
  name: string;
  units: { id: string; label: string; factor: number }[];
}

// For temperature, we handle specially — factor won't work
export const unitCategories: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { id: 'mm', label: 'Millimeter', factor: 0.001 },
      { id: 'cm', label: 'Centimeter', factor: 0.01 },
      { id: 'm', label: 'Meter', factor: 1 },
      { id: 'km', label: 'Kilometer', factor: 1000 },
      { id: 'in', label: 'Inch', factor: 0.0254 },
      { id: 'ft', label: 'Foot', factor: 0.3048 },
      { id: 'yd', label: 'Yard', factor: 0.9144 },
      { id: 'mi', label: 'Mile', factor: 1609.344 },
      { id: 'nm', label: 'Nautical Mile', factor: 1852 },
    ],
  },
  {
    name: 'Weight',
    units: [
      { id: 'mg', label: 'Milligram', factor: 0.000001 },
      { id: 'g', label: 'Gram', factor: 0.001 },
      { id: 'kg', label: 'Kilogram', factor: 1 },
      { id: 'tonne', label: 'Metric Ton', factor: 1000 },
      { id: 'oz', label: 'Ounce', factor: 0.0283495 },
      { id: 'lb', label: 'Pound', factor: 0.453592 },
      { id: 'st', label: 'Stone', factor: 6.35029 },
    ],
  },
  {
    name: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius', factor: 1 },
      { id: 'f', label: 'Fahrenheit', factor: 1 },
      { id: 'k', label: 'Kelvin', factor: 1 },
    ],
  },
  {
    name: 'Speed',
    units: [
      { id: 'mps', label: 'Meters/sec', factor: 1 },
      { id: 'kph', label: 'Km/hour', factor: 0.277778 },
      { id: 'mph', label: 'Miles/hour', factor: 0.44704 },
      { id: 'knot', label: 'Knot', factor: 0.514444 },
      { id: 'fps', label: 'Feet/sec', factor: 0.3048 },
      { id: 'mach', label: 'Mach', factor: 343 },
    ],
  },
  {
    name: 'Area',
    units: [
      { id: 'sqmm', label: 'Square mm', factor: 0.000001 },
      { id: 'sqcm', label: 'Square cm', factor: 0.0001 },
      { id: 'sqm', label: 'Square meter', factor: 1 },
      { id: 'ha', label: 'Hectare', factor: 10000 },
      { id: 'sqkm', label: 'Square km', factor: 1000000 },
      { id: 'sqin', label: 'Square inch', factor: 0.00064516 },
      { id: 'sqft', label: 'Square foot', factor: 0.092903 },
      { id: 'sqyd', label: 'Square yard', factor: 0.836127 },
      { id: 'acre', label: 'Acre', factor: 4046.86 },
      { id: 'sqmi', label: 'Square mile', factor: 2590000 },
    ],
  },
  {
    name: 'Volume',
    units: [
      { id: 'ml', label: 'Milliliter', factor: 0.000001 },
      { id: 'l', label: 'Liter', factor: 0.001 },
      { id: 'cbm', label: 'Cubic meter', factor: 1 },
      { id: 'gal', label: 'US Gallon', factor: 0.00378541 },
      { id: 'qt', label: 'US Quart', factor: 0.000946353 },
      { id: 'pt', label: 'US Pint', factor: 0.000473176 },
      { id: 'cup', label: 'US Cup', factor: 0.000236588 },
      { id: 'floz', label: 'US Fl Oz', factor: 0.0000295735 },
      { id: 'tbsp', label: 'Tablespoon', factor: 0.0000147868 },
      { id: 'tsp', label: 'Teaspoon', factor: 0.00000492892 },
    ],
  },
  {
    name: 'Data',
    units: [
      { id: 'bit', label: 'Bit', factor: 1 },
      { id: 'byte', label: 'Byte', factor: 8 },
      { id: 'kb', label: 'Kilobyte', factor: 8000 },
      { id: 'mb', label: 'Megabyte', factor: 8000000 },
      { id: 'gb', label: 'Gigabyte', factor: 8000000000 },
      { id: 'tb', label: 'Terabyte', factor: 8000000000000 },
      { id: 'kib', label: 'Kibibyte', factor: 8192 },
      { id: 'mib', label: 'Mebibyte', factor: 8388608 },
      { id: 'gib', label: 'Gibibyte', factor: 8589934592 },
    ],
  },
];

export function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case 'c': celsius = value; break;
    case 'f': celsius = (value - 32) * 5 / 9; break;
    case 'k': celsius = value - 273.15; break;
    default: celsius = value;
  }
  // Convert from Celsius
  switch (to) {
    case 'c': return celsius;
    case 'f': return celsius * 9 / 5 + 32;
    case 'k': return celsius + 273.15;
    default: return celsius;
  }
}

export function convertUnit(value: number, fromId: string, toId: string, categoryName: string): number {
  if (categoryName === 'Temperature') {
    return convertTemperature(value, fromId, toId);
  }
  const category = unitCategories.find(c => c.name === categoryName);
  if (!category) return value;
  const fromUnit = category.units.find(u => u.id === fromId);
  const toUnit = category.units.find(u => u.id === toId);
  if (!fromUnit || !toUnit) return value;
  // Convert: value * fromFactor / toFactor
  return (value * fromUnit.factor) / toUnit.factor;
}
