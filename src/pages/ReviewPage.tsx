import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Filter,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { mockEntries } from '../data/mockEntries';
import { getCategoryById } from '../data/mockCategories';
import { getDepartmentById } from '../data/mockDepartments';
import { Card, Button, Badge, Avatar, Input } from '../components/base';
import { formatDate, formatRelativeTime } from '../utils/formatDate';

export const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const pendingEntries = mockEntries.filter((e) => e.status === 'pending');
  const approvedEntries = mockEntries.filter((e) => e.status === 'approved');
  const rejectedEntries = mockEntries.filter((e) => e.status === 'rejected');

  const currentEntries =
    activeTab === 'pending'
      ? pendingEntries
      : activeTab === 'approved'
      ? approvedEntries
      : rejectedEntries;

  const handleApprove = (entryId: string) => {
    console.log('Approve entry:', entryId, reviewComment);
    setSelectedEntry(null);
    setReviewComment('');
  };

  const handleReject = (entryId: string) => {
    console.log('Reject entry:', entryId, reviewComment);
    setSelectedEntry(null);
    setReviewComment('');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">审核中心</h1>
          <p className="text-slate-600">管理和审核词条提交申请</p>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-slate-200 p-1 flex space-x-1">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                待审核 ({pendingEntries.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                已通过 ({approvedEntries.length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                已驳回 ({rejectedEntries.length})
              </button>
            </div>
          </div>
          <Button variant="outline">
            <Filter size={18} className="mr-2" />
            筛选
          </Button>
        </div>

        {currentEntries.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              {currentEntries.map((entry) => (
                <Card
                  key={entry.id}
                  hover
                  className={`p-4 cursor-pointer ${
                    selectedEntry === entry.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedEntry(entry.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-2">
                      {entry.title}
                    </h3>
                    {activeTab === 'pending' && (
                      <Badge variant="warning">待审核</Badge>
                    )}
                    {activeTab === 'approved' && (
                      <Badge variant="success">已通过</Badge>
                    )}
                    {activeTab === 'rejected' && (
                      <Badge variant="danger">已驳回</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {entry.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Avatar src="" name={entry.authorName} size="sm" />
                      <span>{entry.authorName}</span>
                    </div>
                    <span>{formatRelativeTime(entry.updatedAt)}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedEntry ? (
                <Card className="p-6">
                  {(() => {
                    const entry = currentEntries.find((e) => e.id === selectedEntry);
                    if (!entry) return null;
                    const category = getCategoryById(entry.categoryId);
                    const department = getDepartmentById(entry.departmentId);

                    return (
                      <>
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                              {entry.title}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span className="flex items-center">
                                <Avatar src="" name={entry.authorName} size="sm" />
                                <span className="ml-2">{entry.authorName}</span>
                              </span>
                              <span className="flex items-center">
                                <Clock size={16} className="mr-1" />
                                {formatDate(entry.updatedAt)}
                              </span>
                              {category && <span>{category.name}</span>}
                              {department && <span>{department.name}</span>}
                            </div>
                          </div>
                          <Link to={`/entry/${entry.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye size={16} className="mr-1" />
                              查看详情
                            </Button>
                          </Link>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mb-6">
                          <h3 className="font-semibold text-slate-900 mb-3">摘要</h3>
                          <p className="text-slate-700">{entry.summary}</p>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-semibold text-slate-900 mb-3">内容预览</h3>
                          <div
                            className="prose prose-slate max-w-none p-4 bg-slate-50 rounded-lg"
                            dangerouslySetInnerHTML={{ __html: entry.content }}
                          />
                        </div>

                        {activeTab === 'pending' && (
                          <div className="border-t border-slate-200 pt-6">
                            <h3 className="font-semibold text-slate-900 mb-3">审核意见</h3>
                            <textarea
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="填写审核意见..."
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                              rows={4}
                            />
                            <div className="flex justify-end space-x-3">
                              <Button
                                variant="danger"
                                onClick={() => handleReject(entry.id)}
                              >
                                <XCircle size={18} className="mr-2" />
                                驳回
                              </Button>
                              <Button onClick={() => handleApprove(entry.id)}>
                                <CheckCircle size={18} className="mr-2" />
                                通过
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <FileText size={64} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600">
                    {activeTab === 'pending'
                      ? '选择要审核的词条'
                      : '选择要查看的词条'}
                  </p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <AlertCircle size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '已驳回'}的词条</h3>
            <p className="text-slate-600">
              {activeTab === 'pending'
                ? '所有词条都已审核完成'
                : '暂无记录'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
