import React, { useEffect, useState, useMemo } from 'react';
import { Heart, Reply, Send, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { Comment } from '../../types';
import { Avatar, Button } from '../base';
import { formatRelativeTime } from '../../utils/formatDate';
import { useStore } from '../../store';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<'latest' | 'hottest'>('latest');
  const [filterMine, setFilterMine] = useState(false);

  const { addReply, currentUser } = useStore();

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleReply = (parentId: string, entryId: string, content: string) => {
    if (content.trim()) {
      addReply(parentId, entryId, content);
      setReplyingTo(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  const commentMap = useMemo(() => {
    const map: Record<string, Comment[]> = {};
    comments.forEach(comment => {
      const parentId = comment.parentId || 'root';
      if (!map[parentId]) map[parentId] = [];
      map[parentId].push(comment);
    });
    return map;
  }, [comments]);

  const userId = currentUser?.id || 'user-1';

  const filteredAndSortedComments = useMemo(() => {
    let filtered = commentMap['root'] || [];

    if (filterMine) {
      filtered = filtered.filter(comment =>
        comment.userId === userId ||
        comments.some(reply => reply.parentId === comment.id && reply.userId === userId)
      );
    }

    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filtered.sort((a, b) => {
        const aLikes = comments.filter(c => c.parentId === a.id || c.id === a.id).reduce((sum, c) => sum + c.likeCount, 0);
        const bLikes = comments.filter(c => c.parentId === b.id || c.id === b.id).reduce((sum, c) => sum + c.likeCount, 0);
        return bLikes - aLikes;
      });
    }

    return filtered;
  }, [commentMap, filterMine, sortBy, userId, comments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          评论 ({comments.length})
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center ${
                sortBy === 'latest' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={14} className="mr-1" />
              最新
            </button>
            <button
              onClick={() => setSortBy('hottest')}
              className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center ${
                sortBy === 'hottest' ? 'bg-white shadow text-red-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={14} className="mr-1" />
              最热
            </button>
          </div>
          <Button
            variant={filterMine ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterMine(!filterMine)}
          >
            <MessageSquare size={14} className="mr-1" />
            我的参与
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex space-x-3">
          <Avatar name="当前用户" size="md" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <Button onClick={handleSubmit} size="sm" disabled={!newComment.trim()}>
                <Send size={16} className="mr-2" />
                发布评论
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4" key={refreshKey}>
        {filteredAndSortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            commentMap={commentMap}
            replyingTo={replyingTo}
            onReply={(id, name) => setReplyingTo({ id, name })}
            onCancelReply={() => {
              setReplyingTo(null);
            }}
            onSubmitReply={(content) => handleReply(comment.id, comment.entryId, content)}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  commentMap: Record<string, Comment[]>;
  replyingTo: { id: string; name: string } | null;
  onReply: (id: string, name: string) => void;
  onCancelReply: () => void;
  onSubmitReply: (content: string) => void;
  onRefresh: () => void;
  depth: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  commentMap,
  replyingTo,
  onReply,
  onCancelReply,
  onSubmitReply,
  onRefresh,
  depth,
}) => {
  const { likeComment, hasLikedComment, getCommentLikes, addReply } = useStore();
  const [currentLiked, setCurrentLiked] = useState(hasLikedComment(comment.id));
  const [currentLikeCount, setCurrentLikeCount] = useState(getCommentLikes(comment.id));
  const [localReplyContent, setLocalReplyContent] = useState('');

  const replies = commentMap[comment.id] || [];
  const isReplying = replyingTo?.id === comment.id;

  useEffect(() => {
    setCurrentLiked(hasLikedComment(comment.id));
    setCurrentLikeCount(getCommentLikes(comment.id));
  }, [comment.id]);

  const handleLike = () => {
    if (!currentLiked) {
      likeComment(comment.id);
      setCurrentLiked(true);
      setCurrentLikeCount(prev => prev + 1);
    }
  };

  const handleSubmitReply = () => {
    if (localReplyContent.trim()) {
      onSubmitReply(localReplyContent);
      setLocalReplyContent('');
    }
  };

  const handleNestedReply = () => {
    if (localReplyContent.trim()) {
      addReply(comment.id, comment.entryId, localReplyContent);
      setLocalReplyContent('');
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex space-x-3">
        <Avatar src={comment.userAvatar} name={comment.userName} size={depth === 0 ? "md" : "sm"} />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`font-semibold text-slate-900 ${depth > 0 ? 'text-sm' : ''}`}>
              {comment.userName}
            </span>
            <span className="text-xs text-slate-500">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className={`text-slate-700 mb-3 ${depth > 0 ? 'text-sm' : ''}`}>{comment.content}</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                currentLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
              }`}
            >
              <Heart size={14} fill={currentLiked ? 'currentColor' : 'none'} />
              <span>{currentLikeCount}</span>
            </button>
            <button
              onClick={() => onReply(comment.id, comment.userName)}
              className="flex items-center space-x-1 text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Reply size={14} />
              <span>回复</span>
            </button>
          </div>

          {isReplying && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-blue-600 mb-2">回复 @{replyingTo?.name}</div>
              <textarea
                value={localReplyContent}
                onChange={(e) => setLocalReplyContent(e.target.value)}
                placeholder="写下你的回复..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button variant="ghost" size="sm" onClick={onCancelReply}>
                  取消
                </Button>
                <Button size="sm" onClick={handleSubmitReply} disabled={!localReplyContent.trim()}>
                  回复
                </Button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
             <div className="mt-4 space-y-3 pl-4 border-l-2 border-slate-100">
               {replies.map((reply) => (
                 <CommentItem
                   key={reply.id}
                   comment={reply}
                   commentMap={commentMap}
                   replyingTo={replyingTo}
                   onReply={onReply}
                   onCancelReply={onCancelReply}
                   onSubmitReply={onSubmitReply}
                   onRefresh={onRefresh}
                   depth={depth + 1}
                 />
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
