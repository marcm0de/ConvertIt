'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { unitCategories, convertUnit, convertTemperature } from '@/lib/conversions/units';

interface ConversionResult {
  input: string;
  output: string;
  from: string;
  to: string;
}

// Mapping of natural language unit names to unit IDs + category
const UNIT_ALIASES: Record<string, { id: string; category: string }> = {};

// Build aliases from unit categories
unitCategories.forEach((cat) => {
  cat.units.forEach((u) => {
    UNIT_ALIASES[u.id] = { id: u.id, category: cat.name };
    UNIT_ALIASES[u.label.toLowerCase()] = { id: u.id, category: cat.name };
    // Plurals
    UNIT_ALIASES[u.label.toLowerCase() + 's'] = { id: u.id, category: cat.name };
  });
});

// Add common aliases
const COMMON_ALIASES: Record<string, string> = {
  'miles': 'mi', 'mile': 'mi',
  'kilometers': 'km', 'kilometer': 'km', 'kms': 'km',
  'meters': 'm', 'meter': 'm',
  'centimeters': 'cm', 'centimeter': 'cm', 'cms': 'cm',
  'millimeters': 'mm', 'millimeter': 'mm',
  'inches': 'in', 'inch': 'in',
  'feet': 'ft', 'foot': 'ft',
  'yards': 'yd', 'yard': 'yd',
  'pounds': 'lb', 'pound': 'lb', 'lbs': 'lb',
  'ounces': 'oz', 'ounce': 'oz',
  'kilograms': 'kg', 'kilogram': 'kg', 'kgs': 'kg',
  'grams': 'g', 'gram': 'g',
  'celsius': 'c', '°c': 'c',
  'fahrenheit': 'f', '°f': 'f',
  'kelvin': 'k',
  'mph': 'mph', 'kph': 'kph',
  'cups': 'cook-cup', 'cup': 'cook-cup',
  'tablespoons': 'cook-tbsp', 'tablespoon': 'cook-tbsp', 'tbsp': 'cook-tbsp',
  'teaspoons': 'cook-tsp', 'teaspoon': 'cook-tsp', 'tsp': 'cook-tsp',
  'ml': 'cook-ml', 'milliliters': 'cook-ml', 'milliliter': 'cook-ml',
  'liters': 'cook-l', 'liter': 'cook-l',
  'fl oz': 'cook-floz', 'fluid ounce': 'cook-floz', 'fluid ounces': 'cook-floz',
  'gallons': 'cook-gal', 'gallon': 'cook-gal',
  'pints': 'cook-pt', 'pint': 'cook-pt',
  'quarts': 'cook-qt', 'quart': 'cook-qt',
  'bits': 'bit', 'bytes': 'byte',
  'kilobytes': 'kb', 'megabytes': 'mb', 'gigabytes': 'gb', 'terabytes': 'tb',
};

Object.entries(COMMON_ALIASES).forEach(([alias, id]) => {
  if (UNIT_ALIASES[id]) {
    UNIT_ALIASES[alias] = UNIT_ALIASES[id];
  }
});

function resolveUnit(text: string): { id: string; category: string } | null {
  const lower = text.toLowerCase().trim();
  return UNIT_ALIASES[lower] || null;
}

function parseQuery(query: string): ConversionResult | null {
  // Pattern: "<number> <unit> in/to <unit>"
  const match = query.match(/^([\d,.]+)\s+(.+?)\s+(?:in|to|as|into|=)\s+(.+)$/i);
  if (!match) return null;

  const value = parseFloat(match[1].replace(/,/g, ''));
  if (isNaN(value)) return null;

  const fromUnit = resolveUnit(match[2]);
  const toUnit = resolveUnit(match[3]);

  if (!fromUnit || !toUnit) return null;

  // Find a common category
  let category = '';
  if (fromUnit.category === toUnit.category) {
    category = fromUnit.category;
  } else {
    // Try to find if both units exist in any single category
    for (const cat of unitCategories) {
      const hasFrom = cat.units.some((u) => u.id === fromUnit.id);
      const hasTo = cat.units.some((u) => u.id === toUnit.id);
      if (hasFrom && hasTo) {
        category = cat.name;
        break;
      }
    }
    if (!category) return null;
  }

  const result = convertUnit(value, fromUnit.id, toUnit.id, category);
  const fromLabel = unitCategories.find((c) => c.name === category)?.units.find((u) => u.id === fromUnit.id)?.label || match[2];
  const toLabel = unitCategories.find((c) => c.name === category)?.units.find((u) => u.id === toUnit.id)?.label || match[3];

  // Format nicely
  const formatted = result % 1 === 0 ? result.toString() : result.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');

  return {
    input: `${value} ${fromLabel}`,
    output: `${formatted} ${toLabel}`,
    from: fromLabel,
    to: toLabel,
  };
}

export default function QuickConvert() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');

  const handleConvert = () => {
    if (!query.trim()) return;
    const res = parseQuery(query);
    if (res) {
      setResult(res);
      setError('');
    } else {
      setResult(null);
      setError('Could not parse. Try: "5 miles in km" or "100 fahrenheit to celsius"');
    }
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={18} className="text-yellow-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Convert</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
          placeholder='Type "5 miles in km" or "200 celsius to fahrenheit"'
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Convert
        </button>
      </div>
      {result && (
        <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="text-lg font-bold text-green-700 dark:text-green-400">
            {result.input} = {result.output}
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
