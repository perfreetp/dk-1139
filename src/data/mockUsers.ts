import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: '张小明',
    email: 'xiaoming.zhang@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xiaoming',
    role: 'admin',
    departmentId: 'dept-4',
    favoriteEntries: ['entry-1', 'entry-2'],
    createdAt: '2023-01-15',
  },
  {
    id: 'user-2',
    name: '李娜',
    email: 'na.li@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiNa',
    role: 'editor',
    departmentId: 'dept-2',
    favoriteEntries: ['entry-3'],
    createdAt: '2023-03-20',
  },
  {
    id: 'user-3',
    name: '王强',
    email: 'qiang.wang@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangQiang',
    role: 'editor',
    departmentId: 'dept-3',
    favoriteEntries: ['entry-4', 'entry-5'],
    createdAt: '2023-02-10',
  },
  {
    id: 'user-4',
    name: '刘芳',
    email: 'fang.liu@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiuFang',
    role: 'employee',
    departmentId: 'dept-4',
    favoriteEntries: [],
    createdAt: '2023-05-18',
  },
  {
    id: 'user-5',
    name: '陈静',
    email: 'jing.chen@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChenJing',
    role: 'employee',
    departmentId: 'dept-5',
    favoriteEntries: ['entry-6'],
    createdAt: '2023-06-22',
  },
];

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getCurrentUser = (): User => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return mockUsers[0];
};
