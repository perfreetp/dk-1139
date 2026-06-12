import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Tag,
  Megaphone,
  Users,
  TrendingUp,
  Search,
  Eye,
  AlertCircle,
  FileText,
  Plus,
  Edit,
  Trash2,
  Pin,
  PinOff,
  CheckCircle,
  X
} from 'lucide-react';
import { useStore } from '../store';
import { Card, Button, Badge, Input } from '../components/base';
import { formatDate } from '../utils/formatDate';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'categories' | 'announcements' | 'analytics' | 'users'
  >('overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [announcementPinned, setAnnouncementPinned] = useState(false);

  const { entries, categories, announcements, addCategory, updateCategory, deleteCategory, addAnnouncement, updateAnnouncement, deleteAnnouncement, togglePinAnnouncement, getPinnedAnnouncements } = useStore();

  const rootCategories = useMemo(() => categories.filter(c => !c.parentId), [categories]);
  const hotSearches = ['请假制度', '差旅报销', '采购流程', '入职指南', '项目管理'];
  const noResultSearches = ['绩效考核', '年终奖', '股权激励', '期权授予'];
  const popularEntries = useMemo(() =>
    [...entries].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5),
    [entries]
  );

  const pinnedAnnouncements = useMemo(() => getPinnedAnnouncements(), [announcements]);
  const sortedAnnouncements = useMemo(() =>
    [...announcements].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (a.pinOrder || 0) - (b.pinOrder || 0);
    }),
    [announcements]
  );

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      showNotification('请输入分类名称');
      return;
    }
    addCategory({
      name: newCategoryName.trim(),
      icon: 'Building2',
      description: newCategoryDesc.trim() || '新分类',
      sortOrder: categories.length + 1,
    });
    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowCategoryForm(false);
    showNotification('分类添加成功');
  };

  const handleTogglePin = (id: string) => {
    togglePinAnnouncement(id);
    const ann = announcements.find(a => a.id === id);
    showNotification(ann?.isPinned ? '已取消置顶' : '已置顶公告');
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('确定要删除这条公告吗?')) {
      deleteAnnouncement(id);
      showNotification('公告已删除');
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('确定要删除这个分类吗?')) {
      deleteCategory(id);
      showNotification('分类已删除');
    }
  };

  const openAnnouncementForm = (announcement?: any) => {
    if (announcement) {
      setEditingAnnouncement(announcement.id);
      setAnnouncementTitle(announcement.title);
      setAnnouncementContent(announcement.content);
      setAnnouncementPriority(announcement.priority);
      setAnnouncementPinned(announcement.isPinned);
    } else {
      setEditingAnnouncement(null);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setAnnouncementPriority('normal');
      setAnnouncementPinned(false);
    }
    setShowAnnouncementForm(true);
  };

  const handleSaveAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      showNotification('请填写标题和内容');
      return;
    }

    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement, {
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
        priority: announcementPriority,
        isPinned: announcementPinned,
      });
      showNotification('公告更新成功');
    } else {
      addAnnouncement({
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
        priority: announcementPriority,
        isPinned: announcementPinned,
        authorId: 'user-1',
      });
      showNotification('公告发布成功');
    }

    setShowAnnouncementForm(false);
    setEditingAnnouncement(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">词条总数</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{entries.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">分类总数</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Tag size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">公告总数</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{announcements.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Megaphone size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">待审核</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {entries.filter(e => e.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <TrendingUp size={20} className="mr-2 text-blue-600" />
              热门搜索词
            </h3>
          </div>
          <div className="space-y-3">
            {hotSearches.map((keyword, index) => (
              <div key={keyword} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600 w-8">{index + 1}</span>
                  <span className="font-medium text-slate-900">{keyword}</span>
                </div>
                <Badge variant="primary">{Math.floor(Math.random() * 500) + 100} 次</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <AlertCircle size={20} className="mr-2 text-red-600" />
              无结果搜索词
            </h3>
          </div>
          <div className="space-y-3">
            {noResultSearches.map((keyword) => (
              <div key={keyword} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <Search size={16} className="mr-2 text-red-600" />
                  <span className="font-medium text-slate-900">{keyword}</span>
                </div>
                <Button variant="ghost" size="sm">创建词条</Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            这些是用户搜索但未找到结果的关键词,建议优先创建相关词条
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Eye size={20} className="mr-2 text-green-600" />
            热门词条排行
          </h3>
        </div>
        <div className="space-y-3">
          {popularEntries.map((entry, index) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center flex-1">
                <span className="text-2xl font-bold text-slate-400 w-8">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{entry.title}</p>
                  <p className="text-xs text-slate-500">{entry.authorName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="primary">{entry.viewCount} 阅读</Badge>
                <Badge variant="success">{entry.favoriteCount} 收藏</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">分类管理</h2>
        <Button onClick={() => setShowCategoryForm(!showCategoryForm)}>
          <Plus size={18} className="mr-2" />
          新增分类
        </Button>
      </div>

      {showCategoryForm && (
        <Card className="p-6 border-2 border-blue-500">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">添加新分类</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">分类名称</label>
              <Input placeholder="输入分类名称" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">分类描述</label>
              <textarea
                placeholder="输入分类描述(可选)"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCategoryForm(false)}>取消</Button>
              <Button onClick={handleAddCategory}>
                <CheckCircle size={18} className="mr-2" />
                确认添加
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          {rootCategories.map((category) => {
            const children = categories.filter(c => c.parentId === category.id);
            const entryCount = entries.filter(e => e.categoryId === category.id).length;

            return (
              <div key={category.id}>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <Tag size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{category.name}</p>
                      <p className="text-sm text-slate-500">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="default">{entryCount} 篇</Badge>
                    <Button variant="ghost" size="sm" onClick={() => updateCategory(category.id, { name: category.name + ' (已编辑)' })}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="ml-12 mt-2 space-y-2">
                    {children.map((child) => {
                      const childEntryCount = entries.filter(e => e.categoryId === child.id).length;
                      return (
                        <div key={child.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-slate-400">└</span>
                            <p className="font-medium text-slate-900">{child.name}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="default">{childEntryCount} 篇</Badge>
                            <Button variant="ghost" size="sm" onClick={() => updateCategory(child.id, { name: child.name + ' (已编辑)' })}>
                              <Edit size={16} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">公告管理</h2>
        <Button onClick={() => openAnnouncementForm()}>
          <Plus size={18} className="mr-2" />
          发布公告
        </Button>
      </div>

      {showAnnouncementForm && (
        <Card className="p-6 border-2 border-blue-500">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {editingAnnouncement ? '编辑公告' : '发布新公告'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">公告标题</label>
              <Input
                placeholder="输入公告标题"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">公告内容</label>
              <textarea
                placeholder="输入公告内容"
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">优先级</label>
                <select
                  value={announcementPriority}
                  onChange={(e) => setAnnouncementPriority(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">普通</option>
                  <option value="high">重要</option>
                  <option value="urgent">紧急</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    checked={announcementPinned}
                    onChange={(e) => setAnnouncementPinned(e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-slate-700">置顶公告</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAnnouncementForm(false)}>
                <X size={18} className="mr-2" />
                取消
              </Button>
              <Button onClick={handleSaveAnnouncement}>
                <CheckCircle size={18} className="mr-2" />
                {editingAnnouncement ? '保存修改' : '发布公告'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {sortedAnnouncements.length > 0 ? (
          sortedAnnouncements.map((announcement, index) => (
            <Card key={announcement.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {announcement.isPinned && (
                      <Pin size={16} className="text-amber-600" />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900">
                      {announcement.title}
                    </h3>
                    <Badge
                      variant={
                        announcement.priority === 'urgent'
                          ? 'danger'
                          : announcement.priority === 'high'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {announcement.priority === 'urgent'
                        ? '紧急'
                        : announcement.priority === 'high'
                        ? '重要'
                        : '普通'}
                    </Badge>
                    {announcement.isPinned && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        置顶 #{index + 1}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3">{announcement.content}</p>
                  <p className="text-sm text-slate-500">
                    发布时间: {formatDate(announcement.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleTogglePin(announcement.id)}>
                    {announcement.isPinned ? (
                      <>
                        <PinOff size={16} className="mr-1" />
                        取消置顶
                      </>
                    ) : (
                      <>
                        <Pin size={16} className="mr-1" />
                        置顶
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openAnnouncementForm(announcement)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <Megaphone size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无公告</h3>
            <p className="text-slate-600 mb-6">点击上方按钮发布第一条公告</p>
            <Button onClick={() => openAnnouncementForm()}>
              <Plus size={18} className="mr-2" />
              发布公告
            </Button>
          </Card>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">数据分析</h2>
      <Card className="p-6">
        <p className="text-slate-600">详细的数据分析功能开发中...</p>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">用户管理</h2>
        <Button>
          <Plus size={18} className="mr-2" />
          添加用户
        </Button>
      </div>
      <Card className="p-6">
        <p className="text-slate-600">用户管理功能开发中...</p>
      </Card>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-slideIn">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle size={18} className="text-green-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">管理后台</h1>
          <p className="text-slate-600">系统配置和数据管理</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div>
            <Card padding="sm" className="sticky top-24">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 size={20} className="mr-3" />
                  <span className="font-medium">数据概览</span>
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'categories' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Tag size={20} className="mr-3" />
                  <span className="font-medium">分类配置</span>
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'announcements' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Megaphone size={20} className="mr-3" />
                  <span className="font-medium">公告管理</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 size={20} className="mr-3" />
                  <span className="font-medium">数据分析</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Users size={20} className="mr-3" />
                  <span className="font-medium">用户管理</span>
                </button>
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'announcements' && renderAnnouncements()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'users' && renderUsers()}
          </div>
        </div>
      </div>
    </div>
  );
};
