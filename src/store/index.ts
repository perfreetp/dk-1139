import { create } from 'zustand';
import { User, Entry, SearchFilters } from '../types';
import { getCurrentUser } from '../data/mockUsers';

interface AppState {
  currentUser: User | null;
  favorites: string[];
  searchFilters: SearchFilters;
  recentSearches: string[];

  setCurrentUser: (user: User | null) => void;
  login: () => void;
  logout: () => void;
  toggleFavorite: (entryId: string) => void;
  isFavorite: (entryId: string) => boolean;
  setSearchFilters: (filters: SearchFilters) => void;
  addRecentSearch: (keyword: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: getCurrentUser(),
  favorites: [],
  searchFilters: {},
  recentSearches: [],

  setCurrentUser: (user) => set({ currentUser: user }),

  login: () => {
    const user = getCurrentUser();
    localStorage.setItem('currentUser', JSON.stringify(user));
    set({ currentUser: user });
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    set({ currentUser: null });
  },

  toggleFavorite: (entryId) => {
    const { favorites } = get();
    const isFav = favorites.includes(entryId);

    if (isFav) {
      const newFavorites = favorites.filter(id => id !== entryId);
      set({ favorites: newFavorites });
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, entryId];
      set({ favorites: newFavorites });
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  },

  isFavorite: (entryId) => {
    return get().favorites.includes(entryId);
  },

  setSearchFilters: (filters) => {
    set({ searchFilters: filters });
  },

  addRecentSearch: (keyword) => {
    const { recentSearches } = get();
    const filtered = recentSearches.filter(k => k !== keyword);
    const newRecentSearches = [keyword, ...filtered].slice(0, 10);
    set({ recentSearches: newRecentSearches });
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  },
}));
