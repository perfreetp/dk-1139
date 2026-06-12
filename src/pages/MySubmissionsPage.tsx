import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Send,
  AlertCircle,
  Eye,
  User
} from 'lucide-react';
import { useStore } from '../store';
import { Card, Button, Badge, Avatar } from '../components/base';
import { formatDate, formatRelativeTime } from '../utils/formatDate';

export const MySubmissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'draft' | 'pending' | 'rejected'>('draft');
  const navigate = useNavigate();
  const { getMyEntries } = useStore();

  const draftEntries = useMemo(() => getMyEntries('draft'), []);
  const pendingEntries = useMemo(() => getMyEntries('pending'), []);
  const rejectedEntries = useMemo(() => getMyEntries('rejected'), []);

  const currentEntries =
    activeTab === 'draft'
      ? draftEntries
      : activeTab === 'pending'
      ? pendingEntries
      : rejectedEntries;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">我的提交</h1>
          <p className="text-slate-600">管理您的词条草稿和提交记录</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-1 flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('draft')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'draft'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText size={18} />
            <span>草稿</span>
            <Badge variant={draftEntries.length > 0 ? 'warning' : 'default'} className="ml-2">
              {draftEntries.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock size={18} />
            <span>待审核</span>
            <Badge variant={pendingEntries.length > 0 ? 'warning' : 'default'} className="ml-2">
              {pendingEntries.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'rejected'
                ? 'bg-red-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <XCircle size={18} />
            <span>已驳回</span>
            <Badge variant={rejectedEntries.length > 0 ? 'danger' : 'default'} className="ml-2">
              {rejectedEntries.length}
            </Badge>
          </button>
        </div>

        {currentEntries.length > 0 ? (
          <div className="space-y-4">
            {currentEntries.map((entry) => (
              <Card key={entry.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {entry.title}
                      </h3>
                      {activeTab === 'draft' && (
                        <Badge variant="default">草稿</Badge>
                      )}
                      {activeTab === 'pending' && (
                        <Badge variant="warning">待审核</Badge>
                      )}
                      {activeTab === 'rejected' && (
                        <Badge variant="danger">已驳回</Badge>
                      )}
                    </div>
                    <p className="text-slate-600 mb-3 line-clamp-2">{entry.summary}</p>

                    {activeTab === 'rejected' && entry.rejectReason && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle size={16} className="text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">驳回原因</p>
                            <p className="text-sm text-red-700 mt-1">{entry.rejectReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span className="flex items-center">
                        <Avatar src="" name={entry.authorName} size="sm" />
                        <span className="ml-2">{entry.authorName}</span>
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatRelativeTime(entry.updatedAt)}
                      </span>
                      <span>v{entry.version}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <Link to={`/entry/${entry.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        查看
                      </Button>
                    </Link>
                    <Link to={`/editor/${entry.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} className="mr-1" />
                        {activeTab === 'draft' ? '继续编辑' : activeTab === 'rejected' ? '修改后重新提交' : '编辑'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            {activeTab === 'draft' && (
              <>
                <FileText size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无草稿</h3>
                <p className="text-slate-600 mb-6">开始创建新的词条吧</p>
                <Link to="/editor">
                  <Button>
                    <Send size={18} className="mr-2" />
                    创建新词条
                  </Button>
                </Link>
              </>
            )}
            {activeTab === 'pending' && (
              <>
                <Clock size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无待审核词条</h3>
                <p className="text-slate-600 mb-6">提交草稿后会显示在这里</p>
                <Link to="/editor">
                  <Button>创建新词条</Button>
                </Link>
              </>
            )}
            {activeTab === 'rejected' && (
              <>
                <CheckCircle size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无驳回记录</h3>
                <p className="text-slate-600">所有词条都审核通过了</p>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
