export interface Entry {
  id: string;
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  departmentId: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isOfficial: boolean;
  scope: 'all' | 'department' | 'role';
  scopeValue?: string;
  attachments: Attachment[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  viewCount: number;
  favoriteCount: number;
  commentCount: number;
  rejectReason?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  icon: string;
  description: string;
  entryCount: number;
  sortOrder: number;
}

export interface Department {
  id: string;
  name: string;
  parentId?: string;
  manager: string;
  entryCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'employee' | 'editor' | 'admin';
  departmentId: string;
  favoriteEntries: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  entryId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  parentId?: string;
  createdAt: string;
  likeCount: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  isPinned: boolean;
  createdAt: string;
  authorId: string;
  pinOrder?: number;
  scheduledAt?: string;
}

export interface Version {
  id: string;
  entryId: string;
  version: number;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  changeNote: string;
}

export interface Review {
  id: string;
  entryId: string;
  reviewerId: string;
  reviewerName: string;
  action: 'approve' | 'reject';
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'reply' | 'like';
  entryId: string;
  entryTitle: string;
  commentId: string;
  commentContent: string;
  fromUserId: string;
  fromUserName: string;
  createdAt: string;
  isRead: boolean;
}

export interface SearchResult {
  entries: Entry[];
  totalCount: number;
  keywords: string[];
}

export interface SearchFilters {
  keyword?: string;
  categoryId?: string;
  departmentId?: string;
  tags?: string[];
  isOfficial?: boolean;
  isFavorite?: boolean;
}
