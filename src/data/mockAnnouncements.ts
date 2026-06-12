import { Announcement } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: '关于2026年度绩效评估通知',
    content: '公司将于6月20日开始进行2026年度绩效评估,请各部门做好准备...',
    priority: 'high',
    isPinned: true,
    createdAt: '2026-06-10',
    authorId: 'user-1',
  },
  {
    id: 'ann-2',
    title: '新版考勤制度正式实施',
    content: '经过修订的新版考勤制度将于7月1日起正式实施,请全体员工知悉...',
    priority: 'urgent',
    isPinned: true,
    createdAt: '2026-06-08',
    authorId: 'user-1',
  },
  {
    id: 'ann-3',
    title: '端午节放假安排',
    content: '根据国家规定,端午节放假时间为6月22日至6月24日,共3天...',
    priority: 'normal',
    isPinned: false,
    createdAt: '2026-06-05',
    authorId: 'user-1',
  },
  {
    id: 'ann-4',
    title: '知识库系统升级通知',
    content: '公司知识库系统将于本周末进行升级维护,届时系统将暂停服务...',
    priority: 'high',
    isPinned: false,
    createdAt: '2026-06-01',
    authorId: 'user-1',
  },
  {
    id: 'ann-5',
    title: '新员工入职培训安排',
    content: '本月新入职员工培训将于6月25日在会议室A举行...',
    priority: 'normal',
    isPinned: false,
    createdAt: '2026-05-28',
    authorId: 'user-1',
  },
];

export const getAnnouncementById = (id: string): Announcement | undefined => {
  return mockAnnouncements.find(ann => ann.id === id);
};

export const getPinnedAnnouncements = (): Announcement[] => {
  return mockAnnouncements.filter(ann => ann.isPinned);
};
