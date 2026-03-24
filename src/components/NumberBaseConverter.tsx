'use client';

import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { bases, convertBase, toBitDisplay, type Base } from '@/lib/conversions/number-base';
import { useAppStore } from '@/lib/store';

export default function NumberBaseConverter() {
  const [fromBase, setFromBase] = useState<Base>('dec');
  const [toBase, setToBase] = useState<Base>('bin');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [bits, setBits] = useState('');
  const { addHistory } = useAppStore();

  const convert = (val: string, from: Base, to: Base) => {
    setInput(val);
    if (!val) { setOutput(''); setBits(''); return; }
    const result = convertBase(val, from, to);
    setOutput(result);
    setBits(toBitDisplay(val, from));
    if (result) addHistory({ tab: 'number', from, to, input: val, output: result });
  };

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setInput(output);
    setOutput(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') { e.preventDefault(); swap(); }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">From</label>
          <select
            value={fromBase}
            onChange={(e) => { const b = e.target.value as Base; setFromBase(b); convert(input, b, toBase); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {bases.map(b => <option key={b.id} value={b.id}>{b.label} (base {b.radix})</option>)}
          </select>
          <input
            type="text"
            value={input}
            onChange={(e) => convert(e.target.value, fromBase, toBase)}
            placeholder="Enter value"
            className="w-full p-4 text-2xl font-mono rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button onClick={swap} className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors self-center" title="Swap (Tab)">
          <ArrowLeftRight size={20} />
        </button>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">To</label>
          <select
            value={toBase}
            onChange={(e) => { const b = e.target.value as Base; setToBase(b); convert(input, fromBase, b); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {bases.map(b => <option key={b.id} value={b.id}>{b.label} (base {b.radix})</option>)}
          </select>
          <div className="w-full p-4 text-2xl font-mono rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[60px] break-all">
            {output || <span className="text-gray-400">Result</span>}
          </div>
        </div>
      </div>

      {bits && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bit Display</label>
          <p className="mt-2 text-lg font-mono tracking-widest text-gray-900 dark:text-white break-all">{bits}</p>
        </div>
      )}
    </div>
  );
}
