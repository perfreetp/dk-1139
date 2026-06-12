import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Grid,
  List,
  Building2,
  GitBranch,
  Lightbulb,
  Code,
  GraduationCap,
  Briefcase,
  Users,
  Wallet,
  FileCheck,
  ShoppingCart,
  Trophy,
  AlertCircle,
  Filter,
  Heart,
  Award,
  X
} from 'lucide-react';
import { useStore } from '../store';
import { EntryCard } from '../components/business';
import { Card, Input, Button, Tag } from '../components/base';

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOnlyFavorite, setFilterOnlyFavorite] = useState(false);
  const [filterOnlyOfficial, setFilterOnlyOfficial] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('');

  const { categories, entries, favorites } = useStore();
  const rootCategories = categories.filter(c => !c.parentId);
  const selectedCategory = id ? categories.find(c => c.id === id) : null;

  const departments = [
    { id: 'dept-1', name: '技术研发部' },
    { id: 'dept-2', name: '产品设计部' },
    { id: 'dept-3', name: '市场营销部' },
    { id: 'dept-4', name: '人力资源部' },
    { id: 'dept-5', name: '财务部' },
    { id: 'dept-6', name: '行政部' },
    { id: 'dept-7', name: '客户服务部' },
    { id: 'dept-8', name: '质量管理部门' },
  ];

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Building2: <Building2 size={20} />,
      GitBranch: <GitBranch size={20} />,
      Lightbulb: <Lightbulb size={20} />,
      Code: <Code size={20} />,
      GraduationCap: <GraduationCap size={20} />,
      Briefcase: <Briefcase size={20} />,
      Users: <Users size={20} />,
      Wallet: <Wallet size={20} />,
      FileCheck: <FileCheck size={20} />,
      ShoppingCart: <ShoppingCart size={20} />,
      Trophy: <Trophy size={20} />,
      AlertCircle: <AlertCircle size={20} />,
    };
    return icons[iconName] || <Building2 size={20} />;
  };

  const getAllChildCategoryIds = (categoryId: string): string[] => {
    const childIds: string[] = [];
    const directChildren = categories.filter(c => c.parentId === categoryId);
    directChildren.forEach(child => {
      childIds.push(child.id);
      childIds.push(...getAllChildCategoryIds(child.id));
    });
    return childIds;
  };

  const getEntriesForCategory = (categoryId: string): typeof entries => {
    const allCategoryIds = [categoryId, ...getAllChildCategoryIds(categoryId)];
    return entries.filter(entry => allCategoryIds.includes(entry.categoryId));
  };

  const categoryEntries = useMemo(() => {
    if (!id) return [];
    return getEntriesForCategory(id);
  }, [id, categories, entries]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((cid) => cid !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderCategoryTree = (parentCategories: typeof categories, level: number = 0) => {
    return parentCategories.map((category) => {
      const children = categories.filter(c => c.parentId === category.id);
      const hasChildren = children.length > 0;
      const isExpanded = expandedCategories.includes(category.id);
      const entryCount = getEntriesForCategory(category.id).length;

      return (
        <div key={category.id}>
          <Link
            to={`/category/${category.id}`}
            className={`flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors ${
              id === category.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
            style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {getCategoryIcon(category.icon)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{category.name}</p>
                <p className="text-xs text-slate-500">{entryCount} 篇</p>
              </div>
            </div>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleCategory(category.id);
                }}
                className="p-1 rounded hover:bg-blue-200"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </Link>
          {hasChildren && isExpanded && (
            <div className="ml-4">{renderCategoryTree(children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const filteredEntries = useMemo(() => {
    let filtered = [...categoryEntries];

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterOnlyFavorite) {
      filtered = filtered.filter(entry => favorites.includes(entry.id));
    }

    if (filterOnlyOfficial) {
      filtered = filtered.filter(entry => entry.isOfficial);
    }

    if (filterDepartment) {
      filtered = filtered.filter(entry => entry.departmentId === filterDepartment);
    }

    switch (sortBy) {
      case 'hot':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'favorite':
        filtered.sort((a, b) => b.favoriteCount - a.favoriteCount);
        break;
    }

    return filtered;
  }, [categoryEntries, sortBy, searchTerm, filterOnlyFavorite, filterOnlyOfficial, filterDepartment, favorites]);

  const clearFilters = () => {
    setFilterOnlyFavorite(false);
    setFilterOnlyOfficial(false);
    setFilterDepartment('');
  };

  const hasActiveFilters = filterOnlyFavorite || filterOnlyOfficial || filterDepartment;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!id ? (
          <>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">分类目录</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Card padding="sm" className="sticky top-24">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 px-4 pt-4">
                    分类导航
                  </h3>
                  <div className="space-y-1">
                    {renderCategoryTree(rootCategories)}
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rootCategories.map((category) => {
                    const children = categories.filter(c => c.parentId === category.id);
                    const entryCount = getEntriesForCategory(category.id).length;
                    return (
                      <Card key={category.id} hover className="p-6">
                        <Link to={`/category/${category.id}`}>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                              {getCategoryIcon(category.icon)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {category.name}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {entryCount} 篇词条
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-4">
                            {category.description}
                          </p>
                          {children.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {children.slice(0, 3).map((child) => (
                                <Tag key={child.id} variant="default" size="sm">
                                  {child.name}
                                </Tag>
                              ))}
                              {children.length > 3 && (
                                <Tag variant="default" size="sm">
                                  +{children.length - 3}
                                </Tag>
                              )}
                            </div>
                          )}
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
              <Link to="/category" className="hover:text-blue-600">
                分类目录
              </Link>
              <ChevronRight size={16} />
              <span className="text-slate-900 font-medium">
                {selectedCategory?.name}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Card padding="sm" className="sticky top-24">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 px-4 pt-4">
                    分类导航
                  </h3>
                  <div className="space-y-1">
                    {renderCategoryTree(rootCategories)}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {selectedCategory?.name}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedCategory?.description} · 共 {filteredEntries.length} 篇词条
                      {categories.filter(c => c.parentId === id).length > 0 && (
                        <span className="ml-2 text-blue-600">
                          (包含子分类)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-64">
                      <Input
                        placeholder="搜索词条..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={18} />}
                      />
                    </div>
                    <Button
                      variant={showFilters ? 'primary' : 'outline'}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter size={18} className="mr-1" />
                      筛选
                      {hasActiveFilters && (
                        <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                          {Number(filterOnlyFavorite) + Number(filterOnlyOfficial) + Number(!!filterDepartment)}
                        </span>
                      )}
                    </Button>
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${
                          viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-600'
                        }`}
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${
                          viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-600'
                        }`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="recent">最新更新</option>
                      <option value="hot">最热门</option>
                      <option value="favorite">最多收藏</option>
                    </select>
                  </div>
                </div>

                {showFilters && (
                  <Card className="mb-6 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">筛选条件</h3>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X size={16} className="mr-1" />
                          清除筛选
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        filterOnlyFavorite ? 'bg-red-50 border-2 border-red-200' : 'bg-slate-50 border-2 border-transparent'
                      }`}>
                        <input
                          type="checkbox"
                          checked={filterOnlyFavorite}
                          onChange={(e) => setFilterOnlyFavorite(e.target.checked)}
                          className="mr-3"
                        />
                        <Heart size={18} className="mr-2 text-red-500" />
                        <span className="font-medium text-slate-700">只看收藏</span>
                      </label>
                      <label className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        filterOnlyOfficial ? 'bg-amber-50 border-2 border-amber-200' : 'bg-slate-50 border-2 border-transparent'
                      }`}>
                        <input
                          type="checkbox"
                          checked={filterOnlyOfficial}
                          onChange={(e) => setFilterOnlyOfficial(e.target.checked)}
                          className="mr-3"
                        />
                        <Award size={18} className="mr-2 text-amber-500" />
                        <span className="font-medium text-slate-700">只看官方</span>
                      </label>
                      <div>
                        <select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">全部部门</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Card>
                )}

                {filteredEntries.length > 0 ? (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                        : 'space-y-4'
                    }
                  >
                    {filteredEntries.map((entry) => (
                      <EntryCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <AlertCircle size={64} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-600">
                      {searchTerm || hasActiveFilters ? '没有找到匹配的词条' : '该分类下暂无词条'}
                    </p>
                    {(searchTerm || hasActiveFilters) && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          clearFilters();
                        }}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        清除搜索和筛选
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
