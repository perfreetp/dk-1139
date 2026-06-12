import { create } from 'zustand';
import { User, Entry, SearchFilters, Comment, Category, Announcement, Review } from '../types';
import { getCurrentUser } from '../data/mockUsers';
import { mockEntries as initialEntries } from '../data/mockEntries';
import { mockCategories as initialCategories } from '../data/mockCategories';
import { mockAnnouncements as initialAnnouncements } from '../data/mockAnnouncements';
import { mockComments as initialComments } from '../data/mockComments';

interface LikedComment {
  commentId: string;
  timestamp: number;
}

interface AppState {
  currentUser: User | null;
  favorites: string[];
  searchFilters: SearchFilters;
  recentSearches: string[];
  entries: Entry[];
  comments: Comment[];
  categories: Category[];
  announcements: Announcement[];
  reviews: Review[];
  likedComments: LikedComment[];

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
  approveEntry: (id: string, comment: string) => void;
  rejectEntry: (id: string, comment: string) => void;
  getEntryById: (id: string) => Entry | undefined;
  getMyEntries: (status?: string) => Entry[];

  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likeCount'>) => Comment;
  addReply: (parentId: string, entryId: string, content: string) => void;
  likeComment: (commentId: string) => void;
  hasLikedComment: (commentId: string) => boolean;
  getCommentLikes: (commentId: string) => number;

  addCategory: (category: Omit<Category, 'id' | 'entryCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'pinOrder'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;
  getPinnedAnnouncements: () => Announcement[];

  getReviewsByEntryId: (entryId: string) => Review[];

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
  reviews: loadFromStorage('kb_reviews', []),
  likedComments: loadFromStorage('kb_liked_comments', []),

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
        ? { ...entry, status: 'pending', rejectReason: undefined, updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);
    set({ entries: updatedEntries });
  },

  approveEntry: (id, comment) => {
    const { entries, reviews, currentUser } = get();
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, status: 'approved', updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    );

    const newReview: Review = {
      id: generateId(),
      entryId: id,
      reviewerId: currentUser?.id || 'user-1',
      reviewerName: currentUser?.name || '管理员',
      action: 'approve',
      comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [...reviews, newReview];

    saveToStorage('kb_entries', updatedEntries);
    saveToStorage('kb_reviews', updatedReviews);
    set({ entries: updatedEntries, reviews: updatedReviews });
  },

  rejectEntry: (id, comment) => {
    const { entries, reviews, currentUser } = get();
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, status: 'rejected', rejectReason: comment, updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    );

    const newReview: Review = {
      id: generateId(),
      entryId: id,
      reviewerId: currentUser?.id || 'user-1',
      reviewerName: currentUser?.name || '管理员',
      action: 'reject',
      comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [...reviews, newReview];

    saveToStorage('kb_entries', updatedEntries);
    saveToStorage('kb_reviews', updatedReviews);
    set({ entries: updatedEntries, reviews: updatedReviews });
  },

  getEntryById: (id) => {
    return get().entries.find(entry => entry.id === id);
  },

  getMyEntries: (status) => {
    const { entries, currentUser } = get();
    const userId = currentUser?.id || 'user-1';
    let filtered = entries.filter(entry => entry.authorId === userId);

    if (status) {
      filtered = filtered.filter(entry => entry.status === status);
    }

    return filtered.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
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
    return newComment;
  },

  addReply: (parentId, entryId, content) => {
    const { currentUser, comments, entries } = get();
    const newReply: Comment = {
      id: generateId(),
      entryId,
      userId: currentUser?.id || 'user-1',
      userName: currentUser?.name || '匿名用户',
      userAvatar: currentUser?.avatar || '',
      content,
      parentId,
      createdAt: new Date().toISOString().split('T')[0],
      likeCount: 0,
    };

    const updatedComments = [newReply, ...comments];
    saveToStorage('kb_comments', updatedComments);

    const updatedEntries = entries.map(entry =>
      entry.id === entryId
        ? { ...entry, commentCount: entry.commentCount + 1 }
        : entry
    );
    saveToStorage('kb_entries', updatedEntries);

    set({ comments: updatedComments, entries: updatedEntries });
  },

  likeComment: (commentId) => {
    const { comments, likedComments } = get();
    const hasLiked = likedComments.some(lc => lc.commentId === commentId);

    if (!hasLiked) {
      const updatedComments = comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likeCount: comment.likeCount + 1 }
          : comment
      );

      const updatedLikedComments = [...likedComments, { commentId, timestamp: Date.now() }];

      saveToStorage('kb_comments', updatedComments);
      saveToStorage('kb_liked_comments', updatedLikedComments);
      set({ comments: updatedComments, likedComments: updatedLikedComments });
    }
  },

  hasLikedComment: (commentId) => {
    return get().likedComments.some(lc => lc.commentId === commentId);
  },

  getCommentLikes: (commentId) => {
    const comment = get().comments.find(c => c.id === commentId);
    return comment?.likeCount || 0;
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
    const pinnedCount = announcements.filter(a => a.isPinned).length;

    const newAnnouncement: Announcement = {
      ...announcementData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      pinOrder: announcementData.isPinned ? pinnedCount + 1 : undefined,
    };

    const updatedAnnouncements = [newAnnouncement, ...announcements];
    saveToStorage('kb_announcements', updatedAnnouncements);
    set({ announcements: updatedAnnouncements });
  },

  updateAnnouncement: (id, updates) => {
    const { announcements } = get();
    const updatedAnnouncements = announcements.map(ann => {
      if (ann.id === id) {
        let newAnn = { ...ann, ...updates };
        if (updates.isPinned === true && !ann.isPinned) {
          const pinnedCount = announcements.filter(a => a.isPinned).length;
          newAnn.pinOrder = pinnedCount + 1;
        }
        return newAnn;
      }
      return ann;
    });
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
    const pinnedCount = announcements.filter(a => a.isPinned && a.id !== id).length;

    const updatedAnnouncements = announcements.map(ann => {
      if (ann.id === id) {
        if (!ann.isPinned) {
          return { ...ann, isPinned: true, pinOrder: pinnedCount + 1 };
        } else {
          return { ...ann, isPinned: false, pinOrder: undefined };
        }
      }
      return ann;
    });

    saveToStorage('kb_announcements', updatedAnnouncements);
    set({ announcements: updatedAnnouncements });
  },

  getPinnedAnnouncements: () => {
    return get().announcements
      .filter(a => a.isPinned)
      .sort((a, b) => (a.pinOrder || 0) - (b.pinOrder || 0));
  },

  getReviewsByEntryId: (entryId) => {
    return get().reviews.filter(r => r.entryId === entryId);
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
