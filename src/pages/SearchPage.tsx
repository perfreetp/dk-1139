import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search as SearchIcon,
  Filter,
  X,
  TrendingUp,
  Clock,
  Grid,
  List,
  ChevronRight
} from 'lucide-react';
import { searchEntries, mockEntries } from '../data/mockEntries';
import { mockCategories, getRootCategories } from '../data/mockCategories';
import { mockDepartments } from '../data/mockDepartments';
import { EntryCard } from '../components/business';
import { Card, Input, Button, Tag, Badge } from '../components/base';
import { debounce } from '../utils/debounce';
import { useStore } from '../store';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [results, setResults] = useState(mockEntries);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { recentSearches, addRecentSearch } = useStore();

  const categories = getRootCategories();

  const allTags = Array.from(
    new Set(mockEntries.flatMap((entry) => entry.tags))
  ).slice(0, 20);

  const performSearch = (query: string) => {
    let filtered = mockEntries;

    if (query) {
      filtered = searchEntries(query);
    }

    if (selectedCategory) {
      filtered = filtered.filter((entry) => entry.categoryId === selectedCategory);
    }

    if (selectedDepartment) {
      filtered = filtered.filter((entry) => entry.departmentId === selectedDepartment);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((entry) =>
        selectedTags.some((tag) => entry.tags.includes(tag))
      );
    }

    setResults(filtered);
  };

  const debouncedSearch = debounce((query: string) => {
    performSearch(query);
  }, 300);

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setSearchQuery(keyword);
    performSearch(keyword);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ keyword: searchQuery });
      addRecentSearch(searchQuery);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDepartment('');
    setSelectedTags([]);
  };

  const hasActiveFilters = selectedCategory || selectedDepartment || selectedTags.length > 0;

  return (
    <div className="bg-slate-50 min-h-screen">
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
                      performSearch(keyword);
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  部门
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部部门</option>
                  {mockDepartments.map((dept) => (
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
                  onChange={(e) => performSearch(searchQuery)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">最新更新</option>
                  <option value="hot">最热门</option>
                  <option value="favorite">最多收藏</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                标签
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => performSearch(searchQuery)}
              >
                应用筛选
              </Button>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-600">
              找到 <span className="font-semibold text-slate-900">{results.length}</span> 个相关词条
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

        {results.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {results.map((entry) => (
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

        {results.length > 0 && (
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
                        performSearch(keyword);
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
