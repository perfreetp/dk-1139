import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Grid,
  List,
  SortAsc,
  Filter,
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
  AlertCircle
} from 'lucide-react';
import { mockCategories, getCategoriesByParentId, getRootCategories, getCategoryById } from '../data/mockCategories';
import { getEntriesByCategoryId } from '../data/mockEntries';
import { EntryCard } from '../components/business';
import { Card, Input, Button, Tag } from '../components/base';

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  const rootCategories = getRootCategories();
  const selectedCategory = id ? getCategoryById(id) : null;
  const entries = id ? getEntriesByCategoryId(id) : [];

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderCategoryTree = (categories: typeof mockCategories, level: number = 0) => {
    return categories.map((category) => {
      const hasChildren = getCategoriesByParentId(category.id).length > 0;
      const isExpanded = expandedCategories.includes(category.id);
      const children = getCategoriesByParentId(category.id);

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
                <p className="text-xs text-slate-500">{category.entryCount} 篇</p>
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

  const sortedEntries = [...entries].sort((a, b) => {
    switch (sortBy) {
      case 'hot':
        return b.viewCount - a.viewCount;
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'favorite':
        return b.favoriteCount - a.favoriteCount;
      default:
        return 0;
    }
  });

  const filteredEntries = searchTerm
    ? sortedEntries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedEntries;

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
                    const children = getCategoriesByParentId(category.id);
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
                                {category.entryCount} 篇词条
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
                      {selectedCategory?.description}
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
                  <div className="text-center py-12">
                    <p className="text-slate-600">该分类下暂无词条</p>
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
