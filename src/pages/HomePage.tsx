import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Clock, Bookmark, Building2, GitBranch, Lightbulb, Code, GraduationCap } from 'lucide-react';
import { useStore } from '../store';
import { EntryCard, AnnouncementBanner } from '../components/business';
import { Card } from '../components/base';

export const HomePage: React.FC = () => {
  const { entries, announcements, categories } = useStore();

  const hotEntries = useMemo(() =>
    [...entries]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6),
    [entries]
  );

  const recentEntries = useMemo(() =>
    [...entries]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6),
    [entries]
  );

  const rootCategories = useMemo(() =>
    categories.filter(c => !c.parentId),
    [categories]
  );

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 size={24} />;
      case 'GitBranch':
        return <GitBranch size={24} />;
      case 'Lightbulb':
        return <Lightbulb size={24} />;
      case 'Code':
        return <Code size={24} />;
      case 'GraduationCap':
        return <GraduationCap size={24} />;
      default:
        return <Building2 size={24} />;
    }
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnnouncementBanner announcements={announcements} />

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">分类速查</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {rootCategories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card hover className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-3">
                      {getCategoryIcon(category.icon)}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                    <p className="text-xs text-slate-500">{category.entryCount} 篇词条</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">热门词条</h2>
            </div>
            <Link
              to="/search?sort=hot"
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              查看更多
              <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">最新更新</h2>
            </div>
            <Link
              to="/search?sort=recent"
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              查看更多
              <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Bookmark size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">精选收藏</h2>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
            <p className="text-center text-slate-600 mb-4">
              登录后可以收藏感兴趣的词条,方便下次快速查找
            </p>
            <div className="flex justify-center">
              <Link
                to="/search"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                开始探索
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
