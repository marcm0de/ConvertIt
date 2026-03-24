'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArrowLeftRight, Star } from 'lucide-react';
import { unitCategories, convertUnit } from '@/lib/conversions/units';
import { useAppStore } from '@/lib/store';

export default function UnitConverter() {
  const [category, setCategory] = useState(0);
  const [fromUnit, setFromUnit] = useState(unitCategories[0].units[0].id);
  const [toUnit, setToUnit] = useState(unitCategories[0].units[1].id);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { addHistory, addFavorite, removeFavorite, favorites } = useAppStore();

  const cat = unitCategories[category];

  const convert = useCallback((val: string, from: string, to: string, catIdx: number) => {
    if (!val || isNaN(Number(val))) { setOutput(''); return; }
    const result = convertUnit(Number(val), from, to, unitCategories[catIdx].name);
    const formatted = Number.isInteger(result) ? result.toString() : result.toPrecision(10).replace(/\.?0+$/, '');
    setOutput(formatted);
    addHistory({ tab: 'units', from, to, input: val, output: formatted });
  }, [addHistory]);

  useEffect(() => {
    setFromUnit(unitCategories[category].units[0].id);
    setToUnit(unitCategories[category].units[1].id);
    setInput('');
    setOutput('');
  }, [category]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInput(output);
    setOutput(input);
  };

  const favId = favorites.find(f => f.tab === 'units' && f.from === fromUnit && f.to === toUnit)?.id;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') { e.preventDefault(); swap(); }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="flex flex-wrap gap-2">
        {unitCategories.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setCategory(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              i === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">From</label>
          <select
            value={fromUnit}
            onChange={(e) => { setFromUnit(e.target.value); convert(input, e.target.value, toUnit, category); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {cat.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); convert(e.target.value, fromUnit, toUnit, category); }}
            placeholder="Enter value"
            className="w-full p-4 text-2xl rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col items-center gap-2 pb-2">
          <button onClick={swap} className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors" title="Swap (Tab)">
            <ArrowLeftRight size={20} />
          </button>
          <button
            onClick={() => favId ? removeFavorite(favId) : addFavorite({ tab: 'units', from: fromUnit, to: toUnit, label: `${cat.units.find(u=>u.id===fromUnit)?.label} → ${cat.units.find(u=>u.id===toUnit)?.label}` })}
            className={`p-2 rounded-full transition-colors ${favId ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
          >
            <Star size={18} fill={favId ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">To</label>
          <select
            value={toUnit}
            onChange={(e) => { setToUnit(e.target.value); convert(input, fromUnit, e.target.value, category); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {cat.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
          <div className="w-full p-4 text-2xl rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[60px]">
            {output || <span className="text-gray-400">Result</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
