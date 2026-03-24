'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftRight, Globe } from 'lucide-react';
import { timezones, getTimeInZone, getDateInZone } from '@/lib/conversions/timezone';
import { useAppStore } from '@/lib/store';

export default function TimezoneConverter() {
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Europe/London');
  const [inputTime, setInputTime] = useState('');
  const [outputTime, setOutputTime] = useState('');
  const [worldClock, setWorldClock] = useState<Record<string, string>>({});
  const { addHistory } = useAppStore();

  // Update world clock every second
  useEffect(() => {
    const update = () => {
      const clocks: Record<string, string> = {};
      timezones.forEach(tz => { clocks[tz.id] = getTimeInZone(tz.id); });
      setWorldClock(clocks);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const convert = (time: string, from: string, to: string) => {
    if (!time) { setOutputTime(''); return; }
    try {
      const today = new Date().toISOString().split('T')[0];
      const date = new Date(`${today}T${time}:00`);
      const fromStr = date.toLocaleString('en-US', { timeZone: from });
      const toStr = new Date(fromStr).toLocaleString('en-US', { timeZone: to, hour: '2-digit', minute: '2-digit', hour12: true });
      // Better approach: use the offset
      const fromDate = new Date(date.toLocaleString('en-US', { timeZone: from }));
      const toDate = new Date(date.toLocaleString('en-US', { timeZone: to }));
      const diff = toDate.getTime() - fromDate.getTime();
      const result = new Date(date.getTime() + diff);
      const formatted = result.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setOutputTime(formatted);
      addHistory({ tab: 'timezone', from, to, input: time, output: formatted });
    } catch {
      setOutputTime('Invalid time');
    }
  };

  const swap = () => {
    setFromTz(toTz);
    setToTz(fromTz);
    convert(inputTime, toTz, fromTz);
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
            value={fromTz}
            onChange={(e) => { setFromTz(e.target.value); convert(inputTime, e.target.value, toTz); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {timezones.map(tz => <option key={tz.id} value={tz.id}>{tz.label}</option>)}
          </select>
          <input
            type="time"
            value={inputTime}
            onChange={(e) => { setInputTime(e.target.value); convert(e.target.value, fromTz, toTz); }}
            className="w-full p-4 text-2xl rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button onClick={swap} className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors self-center" title="Swap (Tab)">
          <ArrowLeftRight size={20} />
        </button>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">To</label>
          <select
            value={toTz}
            onChange={(e) => { setToTz(e.target.value); convert(inputTime, fromTz, e.target.value); }}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {timezones.map(tz => <option key={tz.id} value={tz.id}>{tz.label}</option>)}
          </select>
          <div className="w-full p-4 text-2xl rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[60px]">
            {outputTime || <span className="text-gray-400">Result</span>}
          </div>
        </div>
      </div>

      {/* World Clock */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Globe size={16} />
          <span className="text-sm font-medium">World Clock</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {timezones.slice(0, 8).map(tz => (
            <div key={tz.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">{tz.label.split('(')[0].trim()}</p>
              <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">{worldClock[tz.id] || '--:--'}</p>
              <p className="text-xs text-gray-400">{getDateInZone(tz.id)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
