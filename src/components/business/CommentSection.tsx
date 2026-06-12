import React, { useEffect, useState, useMemo } from 'react';
import { Heart, Reply, Send } from 'lucide-react';
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

  const { addReply } = useStore();

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

  const rootComments = commentMap['root'] || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">
        评论 ({comments.length})
      </h3>

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
        {rootComments.map((comment) => (
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
  depth: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  commentMap,
  replyingTo,
  onReply,
  onCancelReply,
  onSubmitReply,
  depth,
}) => {
  const { likeComment, hasLikedComment, getCommentLikes } = useStore();
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

  const handleNestedReply = (parentId: string, entryId: string) => {
    if (localReplyContent.trim()) {
      useStore.getState().addReply(parentId, entryId, localReplyContent);
      setLocalReplyContent('');
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
                   onSubmitReply={() => handleNestedReply(reply.id, reply.entryId)}
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
