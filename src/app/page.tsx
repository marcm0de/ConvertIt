'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ruler, Palette, Binary, Globe, DollarSign, Lock, Hash,
  Clock, Star, Sun, Moon, ChevronRight
} from 'lucide-react';
import { useAppStore, type TabId } from '@/lib/store';
import UnitConverter from '@/components/UnitConverter';
import ColorConverter from '@/components/ColorConverter';
import NumberBaseConverter from '@/components/NumberBaseConverter';
import TimezoneConverter from '@/components/TimezoneConverter';
import CurrencyConverter from '@/components/CurrencyConverter';
import EncodingConverter from '@/components/EncodingConverter';
import HashGenerator from '@/components/HashGenerator';
import HistoryPanel from '@/components/HistoryPanel';
import FavoritesPanel from '@/components/FavoritesPanel';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'units', label: 'Units', icon: Ruler },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'number', label: 'Number Base', icon: Binary },
  { id: 'timezone', label: 'Timezone', icon: Globe },
  { id: 'currency', label: 'Currency', icon: DollarSign },
  { id: 'encoding', label: 'Encoding', icon: Lock },
  { id: 'hash', label: 'Hash', icon: Hash },
];

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode, mounted]);

  if (!mounted) return null;
  return <>{children}</>;
}

function ConverterContent() {
  const { activeTab } = useAppStore();
  switch (activeTab) {
    case 'units': return <UnitConverter />;
    case 'color': return <ColorConverter />;
    case 'number': return <NumberBaseConverter />;
    case 'timezone': return <TimezoneConverter />;
    case 'currency': return <CurrencyConverter />;
    case 'encoding': return <EncodingConverter />;
    case 'hash': return <HashGenerator />;
    default: return <UnitConverter />;
  }
}

export default function Home() {
  const { activeTab, setActiveTab, darkMode, toggleDarkMode } = useAppStore();
  const [sidePanel, setSidePanel] = useState<'history' | 'favorites' | null>(null);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <ChevronRight className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ConvertIt</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Universal Converter</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidePanel(sidePanel === 'favorites' ? null : 'favorites')}
                className={`p-2 rounded-lg transition-colors ${sidePanel === 'favorites' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="Favorites"
              >
                <Star size={20} />
              </button>
              <button
                onClick={() => setSidePanel(sidePanel === 'history' ? null : 'history')}
                className={`p-2 rounded-lg transition-colors ${sidePanel === 'history' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="History"
              >
                <Clock size={20} />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex gap-6">
            {/* Converter */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ConverterContent />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Side Panel */}
            <AnimatePresence>
              {sidePanel && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 320 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden flex-shrink-0"
                >
                  <div className="w-80 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    {sidePanel === 'history' ? <HistoryPanel /> : <FavoritesPanel />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
            <p>ConvertIt — All conversions happen client-side. Your data never leaves your browser.</p>
            <p className="mt-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Tab</kbd> to swap values
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
