'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabId = 'units' | 'color' | 'number' | 'timezone' | 'currency' | 'encoding' | 'hash';

export interface HistoryEntry {
  id: string;
  tab: TabId;
  from: string;
  to: string;
  input: string;
  output: string;
  timestamp: number;
}

export interface FavoriteEntry {
  id: string;
  tab: TabId;
  from: string;
  to: string;
  label: string;
}

interface AppState {
  activeTab: TabId;
  darkMode: boolean;
  history: HistoryEntry[];
  favorites: FavoriteEntry[];
  setActiveTab: (tab: TabId) => void;
  toggleDarkMode: () => void;
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  addFavorite: (entry: Omit<FavoriteEntry, 'id'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (tab: TabId, from: string, to: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: 'units',
      darkMode: false,
      history: [],
      favorites: [],
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      addHistory: (entry) =>
        set((s) => ({
          history: [
            { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
            ...s.history,
          ].slice(0, 20),
        })),
      clearHistory: () => set({ history: [] }),
      addFavorite: (entry) =>
        set((s) => ({
          favorites: [...s.favorites, { ...entry, id: crypto.randomUUID() }],
        })),
      removeFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),
      isFavorite: (tab, from, to) =>
        get().favorites.some((f) => f.tab === tab && f.from === from && f.to === to),
    }),
    { name: 'convertit-storage' }
  )
);
