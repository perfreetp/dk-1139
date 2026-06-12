import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Printer,
  Clock,
  Eye,
  Download,
  ChevronRight,
  FileText,
  Tag,
  User,
  History,
  AlertCircle
} from 'lucide-react';
import { getEntryById } from '../data/mockEntries';
import { getCategoryById } from '../data/mockCategories';
import { getDepartmentById } from '../data/mockDepartments';
import { getCommentsByEntryId } from '../data/mockComments';
import { CommentSection } from '../components/business';
import { Card, Tag as TagComponent, Badge, Avatar, Button } from '../components/base';
import { formatDate, formatFileSize } from '../utils/formatDate';
import { useStore } from '../store';

export const EntryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState(getEntryById(id || ''));
  const { toggleFavorite, isFavorite } = useStore();
  const isFav = entry ? isFavorite(entry.id) : false;

  useEffect(() => {
    if (id) {
      const entryData = getEntryById(id);
      setEntry(entryData);
      if (entryData) {
        document.title = `${entryData.title} - 知识百科`;
      }
    }
  }, [id]);

  if (!entry) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">词条不存在</h2>
          <p className="text-slate-600 mb-6">您访问的词条可能已被删除或移动</p>
          <Link to="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryById(entry.categoryId);
  const department = getDepartmentById(entry.departmentId);
  const comments = getCommentsByEntryId(entry.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: entry.title,
        text: entry.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link to="/" className="hover:text-blue-600">首页</Link>
          <ChevronRight size={16} />
          <Link to="/category" className="hover:text-blue-600">分类目录</Link>
          {category && (
            <>
              <ChevronRight size={16} />
              <Link to={`/category/${category.id}`} className="hover:text-blue-600">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={16} />
          <span className="text-slate-900 font-medium truncate">{entry.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.isOfficial && (
                      <Badge variant="primary">官方</Badge>
                    )}
                    {entry.status === 'pending' && (
                      <Badge variant="warning">待审核</Badge>
                    )}
                    {entry.scope === 'department' && (
                      <Badge variant="default">部门内可见</Badge>
                    )}
                    <span className="text-sm text-slate-500">
                      v{entry.version} · {formatDate(entry.updatedAt)}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    {entry.title}
                  </h1>
                  <p className="text-lg text-slate-600 mb-4">{entry.summary}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => toggleFavorite(entry.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isFav
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                    <span>{entry.favoriteCount + (isFav ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <Share2 size={18} />
                    <span>分享</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <Printer size={18} />
                    <span>打印</span>
                  </button>
                </div>
              </div>

              <article
                className="prose prose-slate max-w-none mt-8"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />

              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200">
                <span className="flex items-center text-sm text-slate-600">
                  <Tag size={16} className="mr-1" />
                  标签:
                </span>
                {entry.tags.map((tag) => (
                  <Link key={tag} to={`/search?tag=${encodeURIComponent(tag)}`}>
                    <TagComponent variant="default">{tag}</TagComponent>
                  </Link>
                ))}
              </div>
            </Card>

            {entry.attachments.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Download size={20} className="mr-2" />
                  相关附件
                </h3>
                <div className="space-y-3">
                  {entry.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{attachment.name}</p>
                          <p className="text-sm text-slate-500">
                            {formatFileSize(attachment.size)} · {formatDate(attachment.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        下载
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <CommentSection comments={comments} />
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar src="" name={entry.authorName} size="lg" />
                <div>
                  <p className="font-semibold text-slate-900">{entry.authorName}</p>
                  <p className="text-sm text-slate-500">词条作者</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <Eye size={16} className="mr-2" />
                    阅读
                  </span>
                  <span className="font-medium">{entry.viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <Heart size={16} className="mr-2" />
                    收藏
                  </span>
                  <span className="font-medium">{entry.favoriteCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <Clock size={16} className="mr-2" />
                    更新时间
                  </span>
                  <span className="font-medium">{formatDate(entry.updatedAt)}</span>
                </div>
              </div>
            </Card>

            {category && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">所属分类</h3>
                <Link
                  to={`/category/${category.id}`}
                  className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-500">{category.entryCount} 篇词条</p>
                  </div>
                </Link>
              </Card>
            )}

            {department && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">所属部门</h3>
                <Link
                  to={`/search?department=${department.id}`}
                  className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <User size={20} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{department.name}</p>
                    <p className="text-sm text-slate-500">负责人: {department.manager}</p>
                  </div>
                </Link>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <History size={20} className="mr-2" />
                版本历史
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">v{entry.version} (当前)</p>
                    <p className="text-xs text-slate-500">{formatDate(entry.updatedAt)}</p>
                  </div>
                  <Badge variant="primary">最新</Badge>
                </div>
                {entry.version > 1 && (
                  <button className="w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                    <p className="font-medium text-slate-900">v{entry.version - 1}</p>
                    <p className="text-xs text-slate-500">查看历史版本</p>
                  </button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
