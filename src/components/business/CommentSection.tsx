import React, { useEffect, useState } from 'react';
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const { likeComment, addReply, hasLikedComment, getCommentLikes, comments: allComments } = useStore();

  const rootComments = comments.filter(c => !c.parentId);

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleReply = (parentId: string, entryId: string) => {
    if (replyContent.trim()) {
      addReply(parentId, entryId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
      setRefreshKey(prev => prev + 1);
    }
  };

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
        {rootComments.map((comment) => {
          const replies = comments.filter(c => c.parentId === comment.id);
          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={replies}
              isReplying={replyingTo === comment.id}
              onReply={() => setReplyingTo(comment.id)}
              onCancelReply={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
              replyContent={replyContent}
              onReplyContentChange={setReplyContent}
              onSubmitReply={() => handleReply(comment.id, comment.entryId)}
              entryId={comment.entryId}
            />
          );
        })}
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  isReplying: boolean;
  onReply: () => void;
  onCancelReply: () => void;
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: () => void;
  entryId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies,
  isReplying,
  onReply,
  onCancelReply,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  entryId,
}) => {
  const { likeComment, hasLikedComment, getCommentLikes, comments: allComments } = useStore();
  const [currentLiked, setCurrentLiked] = useState(hasLikedComment(comment.id));
  const [currentLikeCount, setCurrentLikeCount] = useState(getCommentLikes(comment.id));

  const handleLike = () => {
    if (!currentLiked) {
      likeComment(comment.id);
      setCurrentLiked(true);
      setCurrentLikeCount(prev => prev + 1);
    }
  };

  const [replyStates, setReplyStates] = useState<Record<string, { liked: boolean; count: number }>>({});

  useEffect(() => {
    const states: Record<string, { liked: boolean; count: number }> = {};
    replies.forEach(reply => {
      states[reply.id] = {
        liked: hasLikedComment(reply.id),
        count: getCommentLikes(reply.id)
      };
    });
    setReplyStates(states);
  }, [replies, comments]);

  const handleReplyLike = (replyId: string) => {
    const state = replyStates[replyId];
    if (state && !state.liked) {
      likeComment(replyId);
      setReplyStates(prev => ({
        ...prev,
        [replyId]: { liked: true, count: state.count + 1 }
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex space-x-3">
        <Avatar src={comment.userAvatar} name={comment.userName} size="md" />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-slate-900">{comment.userName}</span>
            <span className="text-xs text-slate-500">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-slate-700 mb-3">{comment.content}</p>
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
              onClick={onReply}
              className="flex items-center space-x-1 text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Reply size={14} />
              <span>回复</span>
            </button>
          </div>

          {replies.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-slate-100">
              {replies.map((reply) => {
                const replyState = replyStates[reply.id] || { liked: false, count: 0 };
                return (
                  <div key={reply.id} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <Avatar src={reply.userAvatar} name={reply.userName} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm text-slate-900">{reply.userName}</span>
                          <span className="text-xs text-slate-500">
                            {formatRelativeTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{reply.content}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleReplyLike(reply.id)}
                            className={`flex items-center space-x-1 text-xs transition-colors ${
                              replyState.liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                            }`}
                          >
                            <Heart size={12} fill={replyState.liked ? 'currentColor' : 'none'} />
                            <span>{replyState.count}</span>
                          </button>
                          <button
                            onClick={() => setReplyingTo(reply.id)}
                            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <Reply size={12} />
                            <span>回复</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isReplying && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
              <textarea
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
                placeholder="写下你的回复..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button variant="ghost" size="sm" onClick={onCancelReply}>
                  取消
                </Button>
                <Button size="sm" onClick={onSubmitReply} disabled={!replyContent.trim()}>
                  回复
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
