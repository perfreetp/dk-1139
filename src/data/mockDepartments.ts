import { Department } from '../types';

export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: '技术研发部',
    manager: '张伟',
    entryCount: 35,
  },
  {
    id: 'dept-2',
    name: '产品设计部',
    manager: '李娜',
    entryCount: 18,
  },
  {
    id: 'dept-3',
    name: '市场营销部',
    manager: '王强',
    entryCount: 22,
  },
  {
    id: 'dept-4',
    name: '人力资源部',
    manager: '刘芳',
    entryCount: 15,
  },
  {
    id: 'dept-5',
    name: '财务部',
    manager: '陈静',
    entryCount: 12,
  },
  {
    id: 'dept-6',
    name: '行政部',
    manager: '赵磊',
    entryCount: 10,
  },
  {
    id: 'dept-7',
    name: '客户服务部',
    manager: '孙敏',
    entryCount: 16,
  },
  {
    id: 'dept-8',
    name: '质量管理部门',
    manager: '周涛',
    entryCount: 8,
  },
];

export const getDepartmentById = (id: string): Department | undefined => {
  return mockDepartments.find(dept => dept.id === id);
};
