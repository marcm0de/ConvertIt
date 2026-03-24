'use client';

import { Clock, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const tabLabels: Record<string, string> = {
  units: '📏 Units',
  color: '🎨 Color',
  number: '🔢 Number',
  timezone: '🌍 Timezone',
  currency: '💱 Currency',
  encoding: '🔐 Encoding',
  hash: '#️⃣ Hash',
};

export default function HistoryPanel() {
  const { history, clearHistory } = useAppStore();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Clock size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No conversions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recent Conversions</h3>
        <button onClick={clearHistory} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
          <Trash2 size={14} /> Clear
        </button>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {history.map(entry => (
          <div key={entry.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{tabLabels[entry.tab] || entry.tab}</span>
              <span className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-gray-900 dark:text-white font-mono truncate">
              {entry.input} → {entry.output}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
