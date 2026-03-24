'use client';

import { useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { encodeValue, decodeValue, type EncodingType } from '@/lib/conversions/encoding';
import { useAppStore } from '@/lib/store';

const encodingTypes: { id: EncodingType; label: string }[] = [
  { id: 'base64', label: 'Base64' },
  { id: 'url', label: 'URL Encode' },
  { id: 'html', label: 'HTML Entities' },
];

export default function EncodingConverter() {
  const [type, setType] = useState<EncodingType>('base64');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const { addHistory } = useAppStore();

  const convert = (val: string, t: EncodingType, m: 'encode' | 'decode') => {
    setInput(val);
    if (!val) { setOutput(''); return; }
    const result = m === 'encode' ? encodeValue(val, t) : decodeValue(val, t);
    setOutput(result);
    addHistory({ tab: 'encoding', from: `${t}-${m}`, to: t, input: val, output: result });
  };

  const swap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput(input);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') { e.preventDefault(); swap(); }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="flex flex-wrap gap-2">
        {encodingTypes.map(t => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); convert(input, t.id, mode); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              t.id === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => { setMode('encode'); convert(input, type, 'encode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'encode' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          Encode
        </button>
        <button onClick={swap} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors" title="Swap (Tab)">
          <ArrowLeftRight size={16} />
        </button>
        <button
          onClick={() => { setMode('decode'); convert(input, type, 'decode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'decode' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          Decode
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Input</label>
        <textarea
          value={input}
          onChange={(e) => convert(e.target.value, type, mode)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter encoded text to decode...'}
          rows={4}
          className="w-full p-4 text-lg font-mono rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Output</label>
          {output && (
            <button onClick={copyOutput} className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <div className="w-full p-4 text-lg font-mono rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[120px] break-all whitespace-pre-wrap">
          {output || <span className="text-gray-400">Result will appear here</span>}
        </div>
      </div>
    </div>
  );
}
