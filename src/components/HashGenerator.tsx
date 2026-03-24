'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { generateHash, md5, type HashAlgorithm } from '@/lib/conversions/hash';
import { useAppStore } from '@/lib/store';

const algorithms: { id: string; label: string }[] = [
  { id: 'MD5', label: 'MD5' },
  { id: 'SHA-1', label: 'SHA-1' },
  { id: 'SHA-256', label: 'SHA-256' },
  { id: 'SHA-512', label: 'SHA-512' },
];

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { addHistory } = useAppStore();

  useEffect(() => {
    if (!input) { setHashes({}); return; }
    const compute = async () => {
      const results: Record<string, string> = {};
      results['MD5'] = md5(input);
      for (const algo of ['SHA-1', 'SHA-256', 'SHA-512'] as HashAlgorithm[]) {
        results[algo] = await generateHash(input, algo);
      }
      setHashes(results);
      addHistory({ tab: 'hash', from: 'text', to: 'hash', input, output: results['SHA-256'].substring(0, 16) + '...' });
    };
    const timeout = setTimeout(compute, 300);
    return () => clearTimeout(timeout);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
          className="w-full p-4 text-lg rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      {input && (
        <div className="space-y-3">
          {algorithms.map(algo => (
            <div key={algo.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{algo.label}</span>
                <button
                  onClick={() => copy(algo.id, hashes[algo.id] || '')}
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                >
                  {copiedId === algo.id ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === algo.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-sm text-gray-900 dark:text-white break-all">{hashes[algo.id] || 'Computing...'}</p>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm">
        💡 Hashes are computed client-side using Web Crypto API (SHA) and a JS implementation (MD5). Your data never leaves your browser.
      </div>
    </div>
  );
}
