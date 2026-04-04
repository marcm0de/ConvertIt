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
  'bits': 'bit', 'bytes': 'byte', 'nibbles': 'nibble', 'nibble': 'nibble',
  'kilobytes': 'kb', 'megabytes': 'mb', 'gigabytes': 'gb', 'terabytes': 'tb', 'petabytes': 'pb',
  'kibibytes': 'kib', 'mebibytes': 'mib', 'gibibytes': 'gib', 'tebibytes': 'tib',
  'kibibyte': 'kib', 'mebibyte': 'mib', 'gibibyte': 'gib', 'tebibyte': 'tib',
  'b': 'byte', 'kb': 'kb', 'mb': 'mb', 'gb': 'gb', 'tb': 'tb', 'pb': 'pb',
  'kib': 'kib', 'mib': 'mib', 'gib': 'gib', 'tib': 'tib',
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
    <div className="mb-8 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/30 dark:via-gray-900 dark:to-indigo-950/20 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-1.5 rounded-lg bg-yellow-400/20 dark:bg-yellow-500/15">
          <Zap size={20} className="text-yellow-500" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-base">Quick Convert</h3>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">Natural Language</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
          placeholder='Type "5 miles in km" or "200 celsius to fahrenheit"'
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <button
          onClick={handleConvert}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          Convert
        </button>
      </div>
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 shadow-sm">
          <div className="text-xl font-bold text-green-700 dark:text-green-400">
            {result.input} <span className="text-green-400 dark:text-green-600">=</span> {result.output}
          </div>
        </div>
      )}
      {error && (
        <p className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">{error}</p>
      )}
      {!result && !error && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Try:</span>
          {[
            '100 fahrenheit to celsius',
            '5 miles in km',
            '1 gb in mb',
            '500 grams to pounds',
            '10 kib in bytes',
          ].map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); const res = parseQuery(ex); if (res) { setResult(res); setError(''); } }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 transition-all hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
