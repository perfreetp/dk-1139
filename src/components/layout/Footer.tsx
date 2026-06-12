import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">知</span>
              </div>
              <span className="text-xl font-bold text-white">知识百科</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 max-w-md">
              公司内部知识管理平台,汇聚制度、流程和项目经验,帮助员工快速获取所需知识,提升工作效率。
            </p>
            <div className="text-xs text-slate-500">
              版本 1.0.0 | © 2026 知识百科
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/category" className="hover:text-blue-400 transition-colors">
                  分类目录
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-blue-400 transition-colors">
                  搜索
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">帮助与支持</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-blue-400 transition-colors">
                  使用指南
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-blue-400 transition-colors">
                  意见反馈
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
          <p>本系统仅供内部员工使用,请勿对外传播</p>
        </div>
      </div>
    </footer>
  );
};
