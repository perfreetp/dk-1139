import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Bell, User, LogOut, FileText, ChevronDown } from 'lucide-react';
import { useStore } from '../../store';
import { Avatar, Button } from '../base';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">知</span>
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">
                知识百科
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              首页
            </Link>
            <Link
              to="/category"
              className="px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              分类目录
            </Link>
            {currentUser && (currentUser.role === 'editor' || currentUser.role === 'admin') && (
              <>
                <Link
                  to="/editor"
                  className="px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  编辑工作台
                </Link>
                <Link
                  to="/submissions"
                  className="px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center"
                >
                  <FileText size={16} className="mr-1" />
                  我的提交
                </Link>
              </>
            )}
            {currentUser && currentUser.role === 'admin' && (
              <>
                <Link
                  to="/review"
                  className="px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  审核中心
                </Link>
                <Link
                  to="/admin"
                  className="px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  管理后台
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索词条..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </form>

            <button className="relative p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {currentUser.name}
                  </span>
                  <ChevronDown size={16} className="text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {currentUser.role === 'admin' ? '管理员' : currentUser.role === 'editor' ? '编辑' : '员工'}
                      </span>
                    </div>
                    {(currentUser.role === 'editor' || currentUser.role === 'admin') && (
                      <>
                        <Link
                          to="/editor"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <FileText size={16} className="mr-2" />
                          创建新词条
                        </Link>
                        <Link
                          to="/submissions"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <FileText size={16} className="mr-2" />
                          我的提交
                        </Link>
                      </>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={16} className="mr-2" />
                      个人中心
                    </Link>
                    <button
                      onClick={() => useStore.getState().logout()}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button size="sm">登录</Button>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
            >
              首页
            </Link>
            <Link
              to="/category"
              className="block px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
            >
              分类目录
            </Link>
            {currentUser && (currentUser.role === 'editor' || currentUser.role === 'admin') && (
              <>
                <Link
                  to="/editor"
                  className="block px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  编辑工作台
                </Link>
                <Link
                  to="/submissions"
                  className="block px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  我的提交
                </Link>
              </>
            )}
            {currentUser && currentUser.role === 'admin' && (
              <>
                <Link
                  to="/review"
                  className="block px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  审核中心
                </Link>
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  管理后台
                </Link>
              </>
            )}
          </nav>
          <form onSubmit={handleSearch} className="px-4 py-3 border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索词条..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </form>
        </div>
      )}
    </header>
  );
};
