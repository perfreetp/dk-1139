import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  Send,
  Eye,
  Clock,
  Users,
  Shield,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  History,
  Link as LinkIcon,
  Upload,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../store';
import { Card, Input, Button, Tag, Badge } from '../components/base';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntryById, createEntry, updateEntry, submitForReview, currentUser } = useStore();
  const existingEntry = id ? getEntryById(id) : null;

  const [title, setTitle] = useState(existingEntry?.title || '');
  const [content, setContent] = useState(existingEntry?.content || '');
  const [summary, setSummary] = useState(existingEntry?.summary || '');
  const [categoryId, setCategoryId] = useState(existingEntry?.categoryId || '');
  const [departmentId, setDepartmentId] = useState(existingEntry?.departmentId || '');
  const [tags, setTags] = useState<string[]>(existingEntry?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [scope, setScope] = useState<'all' | 'department' | 'role'>(existingEntry?.scope || 'all');
  const [scopeValue, setScopeValue] = useState(existingEntry?.scopeValue || '');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(id || null);

  useEffect(() => {
    const savedDraft = localStorage.getItem('kb_draft');
    if (savedDraft && !id) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || '');
      setContent(draft.content || '');
      setSummary(draft.summary || '');
      setCategoryId(draft.categoryId || '');
      setDepartmentId(draft.departmentId || '');
      setTags(draft.tags || []);
      setScope(draft.scope || 'all');
      setCurrentEntryId(draft.id || null);
    }
  }, [id]);

  useEffect(() => {
    if (!id && (title || content || summary)) {
      const draftData = {
        title,
        content,
        summary,
        categoryId,
        departmentId,
        tags,
        scope,
        scopeValue,
        id: currentEntryId
      };
      localStorage.setItem('kb_draft', JSON.stringify(draftData));
      setAutoSaveStatus('saved');
    }
  }, [title, content, summary, categoryId, departmentId, tags, scope, scopeValue, id, currentEntryId]);

  const categories = useStore(state => state.categories);
  const mockDepartments = [
    { id: 'dept-1', name: '技术研发部' },
    { id: 'dept-2', name: '产品设计部' },
    { id: 'dept-3', name: '市场营销部' },
    { id: 'dept-4', name: '人力资源部' },
    { id: 'dept-5', name: '财务部' },
    { id: 'dept-6', name: '行政部' },
    { id: 'dept-7', name: '客户服务部' },
    { id: 'dept-8', name: '质量管理部门' },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = '请输入标题';
    if (!summary.trim()) newErrors.summary = '请输入摘要';
    if (!content.trim()) newErrors.content = '请输入正文内容';
    if (!categoryId) newErrors.categoryId = '请选择分类';
    if (!departmentId) newErrors.departmentId = '请选择部门';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    if (!currentEntryId && (title || content || summary)) {
      const entry = createEntry({
        title: title || '未命名草稿',
        content: content || '',
        summary: summary || '',
        categoryId: categoryId || 'cat-1',
        departmentId: departmentId || 'dept-1',
        tags,
        authorId: currentUser?.id || 'user-1',
        authorName: currentUser?.name || '匿名用户',
        version: 1,
        isOfficial: false,
        scope,
        scopeValue,
        attachments: [],
        status: 'draft',
      });
      setCurrentEntryId(entry.id);
      localStorage.setItem('kb_draft_id', entry.id);
    } else if (currentEntryId) {
      updateEntry(currentEntryId, {
        title: title || '未命名草稿',
        content,
        summary,
        categoryId: categoryId || 'cat-1',
        departmentId: departmentId || 'dept-1',
        tags,
        scope,
        scopeValue,
      });
    }
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 500);
  };

  const handleSubmitForReview = () => {
    if (!validateForm()) {
      alert('请填写所有必填项');
      return;
    }

    let entryId = currentEntryId;

    if (!entryId) {
      const entry = createEntry({
        title,
        content,
        summary,
        categoryId,
        departmentId,
        tags,
        authorId: currentUser?.id || 'user-1',
        authorName: currentUser?.name || '匿名用户',
        version: 1,
        isOfficial: false,
        scope,
        scopeValue,
        attachments: [],
        status: 'pending',
      });
      entryId = entry.id;
    } else {
      updateEntry(entryId, {
        title,
        content,
        summary,
        categoryId,
        departmentId,
        tags,
        scope,
        scopeValue,
      });
      submitForReview(entryId);
    }

    localStorage.removeItem('kb_draft');
    localStorage.removeItem('kb_draft_id');

    setSubmitSuccess(true);
    setTimeout(() => {
      navigate('/review');
    }, 1500);
  };

  if (submitSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">提交成功！</h2>
          <p className="text-slate-600 mb-6">您的词条已提交审核,即将跳转到审核中心...</p>
          <div className="animate-pulse">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft size={24} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {existingEntry ? '编辑词条' : '创建新词条'}
              </h1>
              <p className="text-slate-600 mt-1">
                {existingEntry ? `编辑词条: ${existingEntry.title}` : '编写新的知识词条'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-slate-600">已保存</span>
                </>
              )}
              {autoSaveStatus === 'saving' && (
                <>
                  <Clock size={16} className="text-amber-600" />
                  <span className="text-slate-600">保存中...</span>
                </>
              )}
              {autoSaveStatus === 'unsaved' && (
                <>
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-slate-600">未保存</span>
                </>
              )}
            </div>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save size={18} className="mr-2" />
              保存草稿
            </Button>
            <Button onClick={handleSubmitForReview}>
              <Send size={18} className="mr-2" />
              提交审核
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText size={20} className="mr-2" />
                词条内容
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    标题 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="输入词条标题"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setAutoSaveStatus('unsaved');
                    }}
                    className={`text-lg ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    摘要 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="简要描述词条内容..."
                    value={summary}
                    onChange={(e) => {
                      setSummary(e.target.value);
                      setAutoSaveStatus('unsaved');
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.summary ? 'border-red-500' : 'border-slate-300'
                    }`}
                    rows={3}
                  />
                  {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    正文内容 <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-300 p-2 flex flex-wrap gap-1">
                      <button className="p-2 hover:bg-slate-200 rounded text-sm font-bold">B</button>
                      <button className="p-2 hover:bg-slate-200 rounded text-sm italic">I</button>
                      <button className="p-2 hover:bg-slate-200 rounded text-sm underline">U</button>
                      <button className="p-2 hover:bg-slate-200 rounded text-sm font-semibold">H1</button>
                      <button className="p-2 hover:bg-slate-200 rounded text-sm font-semibold">H2</button>
                      <button className="p-2 hover:bg-slate-200 rounded text-sm font-semibold">H3</button>
                      <button className="p-2 hover:bg-slate-200 rounded">•</button>
                      <button className="p-2 hover:bg-slate-200 rounded">1.</button>
                      <button className="p-2 hover:bg-slate-200 rounded">"</button>
                      <button className="p-2 hover:bg-slate-200 rounded">🔗</button>
                      <button className="p-2 hover:bg-slate-200 rounded">📷</button>
                      <button className="p-2 hover:bg-slate-200 rounded">📊</button>
                      <button className="p-2 hover:bg-slate-200 rounded">代码</button>
                    </div>
                    <textarea
                      placeholder="开始编写词条内容..."
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        setAutoSaveStatus('unsaved');
                      }}
                      className={`w-full px-4 py-3 focus:outline-none resize-none ${
                        errors.content ? 'border-red-500' : ''
                      }`}
                      rows={20}
                    />
                  </div>
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Upload size={20} className="mr-2" />
                上传附件
              </h3>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 mb-2">
                  拖拽文件到此处,或点击上传
                </p>
                <p className="text-sm text-slate-500">
                  支持 PDF、Word、Excel、图片等格式,单个文件不超过 10MB
                </p>
              </div>
            </Card>

            {existingEntry && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <History size={20} className="mr-2" />
                    版本历史
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVersionCompare(!showVersionCompare)}
                  >
                    {showVersionCompare ? '隐藏对比' : '对比版本'}
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">v{existingEntry.version} (当前)</p>
                      <p className="text-xs text-slate-500">{existingEntry.updatedAt}</p>
                    </div>
                    <Badge variant="primary">最新</Badge>
                  </div>
                  {existingEntry.version > 1 && (
                    <button className="w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                      <p className="font-medium text-slate-900">v{existingEntry.version - 1}</p>
                      <p className="text-xs text-slate-500">查看历史版本</p>
                    </button>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">基本信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    分类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setAutoSaveStatus('unsaved');
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.categoryId ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">选择分类</option>
                    {categories.filter(c => !c.parentId).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    部门 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => {
                      setDepartmentId(e.target.value);
                      setAutoSaveStatus('unsaved');
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.departmentId ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">选择部门</option>
                    {mockDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && <p className="text-red-500 text-sm mt-1">{errors.departmentId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    标签
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Tag
                        key={tag}
                        variant="primary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Tag>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加标签"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (handleAddTag(), e.preventDefault())}
                    />
                    <Button variant="outline" onClick={handleAddTag}>
                      添加
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Shield size={20} className="mr-2" />
                可见范围
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="radio"
                    name="scope"
                    value="all"
                    checked={scope === 'all'}
                    onChange={(e) => {
                      setScope(e.target.value as 'all');
                      setAutoSaveStatus('unsaved');
                    }}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-slate-900">全员可见</p>
                    <p className="text-xs text-slate-500">所有员工都可以查看</p>
                  </div>
                </label>
                <label className="flex items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="radio"
                    name="scope"
                    value="department"
                    checked={scope === 'department'}
                    onChange={(e) => {
                      setScope(e.target.value as 'department');
                      setAutoSaveStatus('unsaved');
                    }}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">部门可见</p>
                    {scope === 'department' && (
                      <select
                        value={scopeValue}
                        onChange={(e) => {
                          setScopeValue(e.target.value);
                          setAutoSaveStatus('unsaved');
                        }}
                        className="mt-2 w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="">选择部门</option>
                        {mockDepartments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>
                <label className="flex items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="radio"
                    name="scope"
                    value="role"
                    checked={scope === 'role'}
                    onChange={(e) => {
                      setScope(e.target.value as 'role');
                      setAutoSaveStatus('unsaved');
                    }}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">指定角色</p>
                    {scope === 'role' && (
                      <select
                        value={scopeValue}
                        onChange={(e) => {
                          setScopeValue(e.target.value);
                          setAutoSaveStatus('unsaved');
                        }}
                        className="mt-2 w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="">选择角色</option>
                        <option value="admin">管理员</option>
                        <option value="editor">编辑</option>
                        <option value="employee">普通员工</option>
                      </select>
                    )}
                  </div>
                </label>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Bell size={20} className="mr-2" />
                过期提醒
              </h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reminderEnabled}
                    onChange={(e) => setReminderEnabled(e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    启用定期审核提醒
                  </span>
                </label>
                {reminderEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        提醒日期
                      </label>
                      <input
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        提醒说明
                      </label>
                      <textarea
                        placeholder="提醒说明..."
                        value={reminderNote}
                        onChange={(e) => setReminderNote(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>

            {existingEntry && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">重复词条检测</h3>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                    <p className="font-medium text-slate-900 flex items-center">
                      <LinkIcon size={16} className="mr-2" />
                      相关请假制度词条
                    </p>
                    <p className="text-xs text-slate-500 mt-1">相似度: 85%</p>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  点击查看相似词条,可选择合并重复内容
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
