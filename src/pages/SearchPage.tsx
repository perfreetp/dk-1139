import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search as SearchIcon,
  Filter,
  X,
  TrendingUp,
  Clock,
  Grid,
  List,
  CheckCircle,
  Heart,
  Award
} from 'lucide-react';
import { useStore } from '../store';
import { EntryCard } from '../components/business';
import { Card, Input, Button, Tag, Badge } from '../components/base';
import { debounce } from '../utils/debounce';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOnlyFavorite, setFilterOnlyFavorite] = useState(false);
  const [filterOnlyOfficial, setFilterOnlyOfficial] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { entries, categories, recentSearches, addRecentSearch, favorites } = useStore();

  const rootCategories = categories.filter(c => !c.parentId);
  const allTags = useMemo(() => {
    return Array.from(new Set(entries.flatMap((entry) => entry.tags))).slice(0, 20);
  }, [entries]);

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

  const getAllChildCategoryIds = (categoryId: string): string[] => {
    const childIds: string[] = [];
    const directChildren = categories.filter(c => c.parentId === categoryId);
    directChildren.forEach(child => {
      childIds.push(child.id);
      childIds.push(...getAllChildCategoryIds(child.id));
    });
    return childIds;
  };

  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(lowerQuery) ||
          entry.summary.toLowerCase().includes(lowerQuery) ||
          entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
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
  }, [entries, searchQuery, filterOnlyFavorite, filterOnlyOfficial, filterDepartment, sortBy, favorites]);

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setSearchQuery(keyword);
  }, [searchParams]);

  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      addRecentSearch(query);
    }
  }, 500);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ keyword: searchQuery });
      addRecentSearch(searchQuery);
      setToastMessage('搜索完成');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const clearFilters = () => {
    setFilterOnlyFavorite(false);
    setFilterOnlyOfficial(false);
    setFilterDepartment('');
  };

  const hasActiveFilters = filterOnlyFavorite || filterOnlyOfficial || filterDepartment;

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
          <h1 className="text-3xl font-bold text-slate-900 mb-6">搜索词条</h1>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="输入关键词搜索词条..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                icon={<SearchIcon size={20} />}
                className="text-lg py-3"
              />
            </div>
            <Button type="submit" size="lg">
              搜索
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
            </Button>
          </form>

          {recentSearches.length > 0 && !searchQuery && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">最近搜索</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setSearchQuery(keyword);
                      setSearchParams({ keyword });
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showFilters && (
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">筛选条件</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X size={16} className="mr-1" />
                  清除筛选
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  分类
                </label>
                <select
                  onChange={(e) => {}}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部分类</option>
                  {rootCategories.map((cat) => (
                    <React.Fragment key={cat.id}>
                      <option value={cat.id}>{cat.name}</option>
                      {categories
                        .filter(c => c.parentId === cat.id)
                        .map(child => (
                          <option key={child.id} value={child.id}>
                            {'　└ '}{child.name}
                          </option>
                        ))}
                    </React.Fragment>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  部门
                </label>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  排序方式
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">最新更新</option>
                  <option value="hot">最热门</option>
                  <option value="favorite">最多收藏</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  快速筛选
                </label>
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
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-600">
              找到 <span className="font-semibold text-slate-900">{filteredEntries.length}</span> 个相关词条
              {searchQuery && (
                <span>
                  {' '}关于 "<span className="font-semibold">{searchQuery}</span>"
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
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
          </div>
        </div>

        {filteredEntries.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchIcon size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">未找到相关词条</h3>
            <p className="text-slate-600 mb-6">
              尝试使用不同的关键词或调整筛选条件
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/category">
                <Button variant="outline">浏览分类</Button>
              </Link>
              <Button onClick={clearFilters}>清除筛选</Button>
            </div>
          </div>
        )}

        {filteredEntries.length > 0 && (
          <div className="mt-12">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">热门搜索</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['请假制度', '差旅报销', '采购流程', '入职指南', '项目管理'].map(
                  (keyword, index) => (
                    <button
                      key={keyword}
                      onClick={() => {
                        setSearchQuery(keyword);
                        setSearchParams({ keyword });
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <span className="text-blue-600 font-semibold mr-2">{index + 1}</span>
                      {keyword}
                    </button>
                  )
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
