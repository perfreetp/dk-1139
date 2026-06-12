import { Comment } from '../types';

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    entryId: 'entry-1',
    userId: 'user-4',
    userName: '刘芳',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiuFang',
    content: '这份入职指南非常详细,帮助我快速适应了新环境,谢谢！',
    createdAt: '2026-05-20',
    likeCount: 12,
  },
  {
    id: 'comment-2',
    entryId: 'entry-1',
    userId: 'user-5',
    userName: '陈静',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChenJing',
    content: '建议补充关于公司停车场使用的内容',
    parentId: 'comment-1',
    createdAt: '2026-05-21',
    likeCount: 3,
  },
  {
    id: 'comment-3',
    entryId: 'entry-1',
    userId: 'user-1',
    userName: '张小明',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xiaoming',
    content: '感谢反馈,我们会尽快更新这部分内容。',
    parentId: 'comment-2',
    createdAt: '2026-05-21',
    likeCount: 5,
  },
  {
    id: 'comment-4',
    entryId: 'entry-2',
    userId: 'user-4',
    userName: '刘芳',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiuFang',
    content: '年假计算方式很清晰,但婚假的具体天数能详细说明一下吗？',
    createdAt: '2026-04-15',
    likeCount: 8,
  },
  {
    id: 'comment-5',
    entryId: 'entry-3',
    userId: 'user-5',
    userName: '陈静',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChenJing',
    content: '报销流程说明得很清楚,但希望能出一个视频教程,方便大家学习。',
    createdAt: '2026-03-28',
    likeCount: 6,
  },
  {
    id: 'comment-6',
    entryId: 'entry-5',
    userId: 'user-2',
    userName: '李娜',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiNa',
    content: '项目A的经验总结对我们正在进行的项目B很有参考价值！',
    createdAt: '2026-04-05',
    likeCount: 15,
  },
  {
    id: 'comment-7',
    entryId: 'entry-7',
    userId: 'user-2',
    userName: '李娜',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiNa',
    content: '代码规范这部分讲得很好,建议新人必读！',
    createdAt: '2026-04-18',
    likeCount: 9,
  },
];

export const getCommentsByEntryId = (entryId: string): Comment[] => {
  return mockComments.filter(comment => comment.entryId === entryId);
};

export const getRootComments = (entryId: string): Comment[] => {
  return mockComments.filter(comment => comment.entryId === entryId && !comment.parentId);
};

export const getRepliesByParentId = (parentId: string): Comment[] => {
  return mockComments.filter(comment => comment.parentId === parentId);
};
