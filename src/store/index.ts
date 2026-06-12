import { create } from 'zustand';
import { User, Entry, SearchFilters, Comment, Category, Announcement, Review } from '../types';
import { getCurrentUser } from '../data/mockUsers';
import { mockEntries as initialEntries } from '../data/mockEntries';
import { mockCategories as initialCategories } from '../data/mockCategories';
import { mockAnnouncements as initialAnnouncements } from '../data/mockAnnouncements';
import { mockComments as initialComments } from '../data/mockComments';

interface AppState {
  currentUser: User | null;
  favorites: string[];
  searchFilters: SearchFilters;
  recentSearches: string[];
  entries: Entry[];
  comments: Comment[];
  categories: Category[];
  announcements: Announcement[];
  pendingReviews: Review[];

  setCurrentUser: (user: User | null) => void;
  login: () => void;
  logout: () => void;
  toggleFavorite: (entryId: string) => void;
  isFavorite: (entryId: string) => boolean;
  setSearchFilters: (filters: SearchFilters) => void;
  addRecentSearch: (keyword: string) => void;

  createEntry: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'favoriteCount' | 'commentCount'>) => Entry;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  submitForReview: (id: string) => void;
  approveEntry: (id: string) => void;
  rejectEntry: (id: string) => void;
  getEntryById: (id: string) => Entry | undefined;

  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likeCount'>) => void;
  likeComment: (commentId: string) => void;

  addCategory: (category: Omit<Category, 'id' | 'entryCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;

  incrementViewCount: (entryId: string) => void;
}

const loadFromStorage = <T>(key: string, initialValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
};

const saveToStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useStore = create<AppState>((set, get) => ({
  currentUser: getCurrentUser(),
  favorites: loadFromStorage('kb_favorites', []),
  searchFilters: {},
  recentSearches: loadFromStorage('kb_recent_searches', []),
  entries: loadFromStorage('kb_entries', initialEntries),
  comments: loadFromStorage('kb_comments', initialComments),
  categories: loadFromStorage('kb_categories', initialCategories),
  announcements: loadFromStorage('kb_announcements', initialAnnouncements),
  pendingReviews: [],

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
    const { favorites, entries } = get();
    const isFav = favorites.includes(entryId);

    if (isFav) {
      const newFavorites = favorites.filter(id => id !== entryId);
      saveToStorage('kb_favorites', newFavorites);
      set({ favorites: newFavorites });
    } else {
      const newFavorites = [...favorites, entryId];
      saveToStorage('kb_favorites', newFavorites);
      set({ favorites: newFavorites });
    }
  },

  isFavorite: (entryId) => {
    return get().favorites.includes(entryId);
  },

  setSearchFilters: (filters) => set({ searchFilters: filters }),

  addRecentSearch: (keyword) => {
    const { recentSearches } = get();
    const filtered = recentSearches.filter(k => k !== keyword);
    const newRecentSearches = [keyword, ...filtered].slice(0, 10);
    saveToStorage('kb_recent_searches', newRecentSearches);
    set({ recentSearches: newRecentSearches });
  },

  createEntry: (entryData) => {
    const newEntry: Entry = {
      ...entryData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewCount: 0,
      favoriteCount: 0,
      commentCount: 0,
    };

    const { entries, categories } = get();
    const updatedEntries = [newEntry, ...entries];
    saveToStorage('kb_entries', updatedEntries);

    const updatedCategories = categories.map(cat =>
      cat.id === newEntry.categoryId
        ? { ...cat, entryCount: cat.entryCount + 1 }
        : cat
    );
    saveToStorage('kb_categories', updatedCategories);

    set({ entries: updatedEntries, categories: updatedCategories });
    return newEntry;
  },

  updateEntry: (id, updates) => {
    const { entries, categories } = get();
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);

    if (updates.categoryId) {
      const updatedCategories = categories.map(cat => ({
        ...cat,
        entryCount: entries.filter(e => e.categoryId === cat.id).length
      }));
      saveToStorage('kb_categories', updatedCategories);
      set({ categories: updatedCategories });
    }

    set({ entries: updatedEntries });
  },

  submitForReview: (id) => {
    const { entries } = get();
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, status: 'pending', updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);
    set({ entries: updatedEntries });
  },

  approveEntry: (id) => {
    const { entries } = get();
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, status: 'approved', updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);
    set({ entries: updatedEntries });
  },

  rejectEntry: (id) => {
    const { entries } = get();
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, status: 'rejected', updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);
    set({ entries: updatedEntries });
  },

  getEntryById: (id) => {
    return get().entries.find(entry => entry.id === id);
  },

  addComment: (commentData) => {
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      likeCount: 0,
    };

    const { comments, entries } = get();
    const updatedComments = [newComment, ...comments];
    saveToStorage('kb_comments', updatedComments);

    const updatedEntries = entries.map(entry =>
      entry.id === commentData.entryId
        ? { ...entry, commentCount: entry.commentCount + 1 }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);

    set({ comments: updatedComments, entries: updatedEntries });
  },

  likeComment: (commentId) => {
    const { comments } = get();
    const updatedComments = comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likeCount: comment.likeCount + 1 }
        : comment
    );
    saveToStorage('kb_comments', updatedComments);
    set({ comments: updatedComments });
  },

  addCategory: (categoryData) => {
    const { categories } = get();
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
      entryCount: 0,
    };
    const updatedCategories = [...categories, newCategory];
    saveToStorage('kb_categories', updatedCategories);
    set({ categories: updatedCategories });
  },

  updateCategory: (id, updates) => {
    const { categories } = get();
    const updatedCategories = categories.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    );
    saveToStorage('kb_categories', updatedCategories);
    set({ categories: updatedCategories });
  },

  deleteCategory: (id) => {
    const { categories } = get();
    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveToStorage('kb_categories', updatedCategories);
    set({ categories: updatedCategories });
  },

  addAnnouncement: (announcementData) => {
    const { announcements } = get();
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedAnnouncements = [newAnnouncement, ...announcements];
    saveToStorage('kb_announcements', updatedAnnouncements);
    set({ announcements: updatedAnnouncements });
  },

  updateAnnouncement: (id, updates) => {
    const { announcements } = get();
    const updatedAnnouncements = announcements.map(ann =>
      ann.id === id ? { ...ann, ...updates } : ann
    );
    saveToStorage('kb_announcements', updatedAnnouncements);
    set({ announcements: updatedAnnouncements });
  },

  deleteAnnouncement: (id) => {
    const { announcements } = get();
    const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
    saveToStorage('kb_announcements', updatedAnnouncements);
    set({ announcements: updatedAnnouncements });
  },

  togglePinAnnouncement: (id) => {
    const { announcements } = get();
    const updatedAnnouncements = announcements.map(ann =>
      ann.id === id ? { ...ann, isPinned: !ann.isPinned } : ann
    );
    saveToStorage('kb_announcements', updatedAnnouncements);
    set({ announcements: updatedAnnouncements });
  },

  incrementViewCount: (entryId) => {
    const { entries } = get();
    const updatedEntries = entries.map(entry =>
      entry.id === entryId
        ? { ...entry, viewCount: entry.viewCount + 1 }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);
    set({ entries: updatedEntries });
  },
}));
