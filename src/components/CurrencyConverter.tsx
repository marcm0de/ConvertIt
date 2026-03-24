'use client';

import { useState } from 'react';
import { ArrowLeftRight, Star } from 'lucide-react';
import { currencies, convertCurrency } from '@/lib/conversions/currency';
import { useAppStore } from '@/lib/store';

export default function CurrencyConverter() {
  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('EUR');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { addHistory, addFavorite, removeFavorite, favorites } = useAppStore();

  const convert = (val: string, from: string, to: string) => {
    if (!val || isNaN(Number(val))) { setOutput(''); return; }
    const result = convertCurrency(Number(val), from, to);
    const formatted = result.toFixed(2);
    setOutput(formatted);
    addHistory({ tab: 'currency', from, to, input: val, output: formatted });
  };

  const swap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
    setInput(output);
    convert(output, toCur, fromCur);
  };

  const favId = favorites.find(f => f.tab === 'currency' && f.from === fromCur && f.to === toCur)?.id;
  const fromSymbol = currencies.find(c => c.id === fromCur)?.symbol || '';
  const toSymbol = currencies.find(c => c.id === toCur)?.symbol || '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') { e.preventDefault(); swap(); }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-sm">
        ⚠️ Using mock exchange rates for demo purposes
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">From</label>
          <select
            value={fromCur}
            onChange={(e) => { setFromCur(e.target.value); convert(input, e.target.value, toCur); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {currencies.map(c => <option key={c.id} value={c.id}>{c.symbol} {c.id} - {c.label}</option>)}
          </select>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">{fromSymbol}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); convert(e.target.value, fromCur, toCur); }}
              placeholder="0.00"
              className="w-full p-4 pl-10 text-2xl rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pb-2">
          <button onClick={swap} className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors" title="Swap (Tab)">
            <ArrowLeftRight size={20} />
          </button>
          <button
            onClick={() => favId ? removeFavorite(favId) : addFavorite({ tab: 'currency', from: fromCur, to: toCur, label: `${fromCur} → ${toCur}` })}
            className={`p-2 rounded-full transition-colors ${favId ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
          >
            <Star size={18} fill={favId ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">To</label>
          <select
            value={toCur}
            onChange={(e) => { setToCur(e.target.value); convert(input, fromCur, e.target.value); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {currencies.map(c => <option key={c.id} value={c.id}>{c.symbol} {c.id} - {c.label}</option>)}
          </select>
          <div className="relative w-full p-4 pl-10 text-2xl rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[60px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">{toSymbol}</span>
            {output || <span className="text-gray-400">0.00</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
