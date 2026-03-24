'use client';

import { Star, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const tabLabels: Record<string, string> = {
  units: '📏',
  color: '🎨',
  number: '🔢',
  timezone: '🌍',
  currency: '💱',
  encoding: '🔐',
  hash: '#️⃣',
};

export default function FavoritesPanel() {
  const { favorites, removeFavorite, setActiveTab } = useAppStore();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Star size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No favorites yet</p>
        <p className="text-xs mt-1">Star a conversion to pin it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Favorites</h3>
      <div className="space-y-2">
        {favorites.map(fav => (
          <div
            key={fav.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            onClick={() => setActiveTab(fav.tab)}
          >
            <div className="flex items-center gap-2">
              <span>{tabLabels[fav.tab]}</span>
              <span className="text-sm text-gray-900 dark:text-white">{fav.label}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
