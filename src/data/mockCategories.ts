import { Category } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: '公司制度',
    parentId: undefined,
    icon: 'Building2',
    description: '公司基本管理制度和规范',
    entryCount: 24,
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: '人事制度',
    parentId: 'cat-1',
    icon: 'Users',
    description: '人力资源管理相关规定',
    entryCount: 18,
    sortOrder: 1,
  },
  {
    id: 'cat-3',
    name: '财务制度',
    parentId: 'cat-1',
    icon: 'Wallet',
    description: '财务管理和报销制度',
    entryCount: 15,
    sortOrder: 2,
  },
  {
    id: 'cat-4',
    name: '行政制度',
    parentId: 'cat-1',
    icon: 'Briefcase',
    description: '行政事务管理规定',
    entryCount: 12,
    sortOrder: 3,
  },
  {
    id: 'cat-5',
    name: '业务流程',
    parentId: undefined,
    icon: 'GitBranch',
    description: '各类业务流程和操作指南',
    entryCount: 36,
    sortOrder: 2,
  },
  {
    id: 'cat-6',
    name: '审批流程',
    parentId: 'cat-5',
    icon: 'FileCheck',
    description: '各类审批申请流程',
    entryCount: 20,
    sortOrder: 1,
  },
  {
    id: 'cat-7',
    name: '采购流程',
    parentId: 'cat-5',
    icon: 'ShoppingCart',
    description: '物资采购和供应商管理',
    entryCount: 8,
    sortOrder: 2,
  },
  {
    id: 'cat-8',
    name: '项目经验',
    parentId: undefined,
    icon: 'Lightbulb',
    description: '项目实施经验和案例',
    entryCount: 45,
    sortOrder: 3,
  },
  {
    id: 'cat-9',
    name: '成功案例',
    parentId: 'cat-8',
    icon: 'Trophy',
    description: '优秀项目案例分享',
    entryCount: 25,
    sortOrder: 1,
  },
  {
    id: 'cat-10',
    name: '失败教训',
    parentId: 'cat-8',
    icon: 'AlertCircle',
    description: '项目失败经验总结',
    entryCount: 10,
    sortOrder: 2,
  },
  {
    id: 'cat-11',
    name: '技术文档',
    parentId: undefined,
    icon: 'Code',
    description: '技术架构和开发文档',
    entryCount: 52,
    sortOrder: 4,
  },
  {
    id: 'cat-12',
    name: '培训资料',
    parentId: undefined,
    icon: 'GraduationCap',
    description: '员工培训和技能提升',
    entryCount: 28,
    sortOrder: 5,
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(cat => cat.id === id);
};

export const getCategoriesByParentId = (parentId?: string): Category[] => {
  return mockCategories.filter(cat => cat.parentId === parentId);
};

export const getRootCategories = (): Category[] => {
  return mockCategories.filter(cat => !cat.parentId);
};
