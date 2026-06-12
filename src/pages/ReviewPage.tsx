import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  AlertCircle,
  CheckCircle as CheckCircleIcon,
  User,
  MessageSquare,
  History
} from 'lucide-react';
import { useStore } from '../store';
import { Card, Button, Badge, Avatar } from '../components/base';
import { formatDate, formatRelativeTime } from '../utils/formatDate';

export const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const { entries, categories, approveEntry, rejectEntry, getReviewsByEntryId } = useStore();

  const pendingEntries = useMemo(() =>
    entries.filter((e) => e.status === 'pending'),
    [entries]
  );
  const approvedEntries = useMemo(() =>
    entries.filter((e) => e.status === 'approved'),
    [entries]
  );
  const rejectedEntries = useMemo(() =>
    entries.filter((e) => e.status === 'rejected'),
    [entries]
  );

  const currentEntries =
    activeTab === 'pending'
      ? pendingEntries
      : activeTab === 'approved'
      ? approvedEntries
      : rejectedEntries;

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApprove = (entryId: string) => {
    approveEntry(entryId, reviewComment || '审核通过');
    setReviewComment('');
    showNotification('词条已通过审核', 'success');
    setSelectedEntry(null);
  };

  const handleReject = (entryId: string) => {
    if (!reviewComment.trim()) {
      showNotification('请填写驳回原因', 'error');
      return;
    }
    rejectEntry(entryId, reviewComment);
    showNotification('词条已驳回', 'success');
    setReviewComment('');
    setSelectedEntry(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-slideIn">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {toastType === 'success' ? (
              <CheckCircleIcon size={18} />
            ) : (
              <XCircle size={18} />
            )}
            <span>{ toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">审核中心</h1>
          <p className="text-slate-600">管理和审核词条提交申请</p>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-slate-200 p-1 flex space-x-1">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  setSelectedEntry(null);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>待审核</span>
                {pendingEntries.length > 0 && (
                  <Badge variant="warning">{pendingEntries.length}</Badge>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('approved');
                  setSelectedEntry(null);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>已通过</span>
                <span className="text-sm opacity-75">({approvedEntries.length})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('rejected');
                  setSelectedEntry(null);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>已驳回</span>
                <span className="text-sm opacity-75">({rejectedEntries.length})</span>
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
              {currentEntries.map((entry) => {
                const reviews = getReviewsByEntryId(entry.id);
                const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

                return (
                  <Card
                    key={entry.id}
                    hover
                    className={`p-4 cursor-pointer transition-all ${
                      selectedEntry === entry.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedEntry(entry.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">
                        {entry.title}
                      </h3>
                      {activeTab === 'pending' && (
                        <Badge variant="warning" className="ml-2">待审核</Badge>
                      )}
                      {activeTab === 'approved' && (
                        <Badge variant="success" className="ml-2">已通过</Badge>
                      )}
                      {activeTab === 'rejected' && (
                        <Badge variant="danger" className="ml-2">已驳回</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {entry.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar src="" name={entry.authorName} size="sm" />
                        <span>{entry.authorName}</span>
                      </div>
                      <span>{formatRelativeTime(entry.updatedAt)}</span>
                    </div>

                    {(activeTab === 'approved' || activeTab === 'rejected') && latestReview && (
                      <div className={`mt-3 pt-3 border-t ${
                        latestReview.action === 'approve' ? 'border-green-200' : 'border-red-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center space-x-1">
                            {latestReview.action === 'approve' ? (
                              <CheckCircle size={12} className="text-green-600" />
                            ) : (
                              <XCircle size={12} className="text-red-600" />
                            )}
                            <span className={latestReview.action === 'approve' ? 'text-green-700' : 'text-red-700'}>
                              {latestReview.action === 'approve' ? '通过' : '驳回'}
                            </span>
                          </div>
                          <span className="text-slate-500">
                            {formatDate(latestReview.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-600 mb-1">
                          <User size={12} />
                          <span>处理人: {latestReview.reviewerName}</span>
                        </div>
                        {latestReview.comment && (
                          <p className={`text-xs line-clamp-2 ${
                            latestReview.action === 'approve' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            意见: {latestReview.comment}
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-2">
              {selectedEntry ? (
                (() => {
                  const entry = currentEntries.find((e) => e.id === selectedEntry);
                  if (!entry) return null;
                  const category = categories.find(c => c.id === entry.categoryId);
                  const reviews = getReviewsByEntryId(entry.id);

                  return (
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {entry.title}
                          </h2>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 flex-wrap gap-2">
                            <span className="flex items-center">
                              <Avatar src="" name={entry.authorName} size="sm" />
                              <span className="ml-2">{entry.authorName}</span>
                            </span>
                            <span className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              {formatDate(entry.updatedAt)}
                            </span>
                            {category && <span className="bg-slate-100 px-2 py-1 rounded">{category.name}</span>}
                            <span className="bg-slate-100 px-2 py-1 rounded">v{entry.version}</span>
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
                          className="prose prose-slate max-w-none p-4 bg-slate-50 rounded-lg max-h-96 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: entry.content }}
                        />
                      </div>

                      {entry.tags.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-slate-900 mb-3">标签</h3>
                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                              <Badge key={tag} variant="default">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {reviews.length > 0 && (
                        <div className="mb-6 border-t border-slate-200 pt-6">
                          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                            <History size={18} className="mr-2" />
                            审核历史
                          </h3>
                          <div className="space-y-3">
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className={`p-4 rounded-lg ${
                                  review.action === 'approve'
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {review.action === 'approve' ? (
                                      <CheckCircle size={16} className="text-green-600" />
                                    ) : (
                                      <XCircle size={16} className="text-red-600" />
                                    )}
                                    <span className={`font-medium ${
                                      review.action === 'approve' ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                      {review.action === 'approve' ? '已通过' : '已驳回'}
                                    </span>
                                    <span className="text-sm text-slate-600 flex items-center">
                                      <User size={14} className="mr-1" />
                                      {review.reviewerName}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    {formatDate(review.createdAt)}
                                  </span>
                                </div>
                                {review.comment && (
                                  <div className="mt-2 p-2 bg-white rounded border border-slate-200">
                                    <p className="text-sm text-slate-700 flex items-start">
                                      <MessageSquare size={14} className="mr-2 mt-0.5 text-slate-400" />
                                      {review.comment}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
                    </Card>
                  );
                })()
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
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '已驳回'}的词条
            </h3>
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
