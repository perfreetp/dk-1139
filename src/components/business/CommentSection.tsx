import React from 'react';
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
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  const { likeComment } = useStore();
  const [likedComments, setLikedComments] = React.useState<Set<string>>(new Set());

  const rootComments = comments.filter(c => !c.parentId);

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleReply = (parentId: string) => {
    if (replyContent.trim()) {
      console.log('Reply to', parentId, ':', replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleLike = (commentId: string) => {
    if (!likedComments.has(commentId)) {
      likeComment(commentId);
      setLikedComments(prev => new Set([...prev, commentId]));
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
              <Button onClick={handleSubmit} size="sm">
                <Send size={16} className="mr-2" />
                发布评论
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rootComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={comments.filter(c => c.parentId === comment.id)}
            isReplying={replyingTo === comment.id}
            onReply={() => setReplyingTo(comment.id)}
            onCancelReply={() => {
              setReplyingTo(null);
              setReplyContent('');
            }}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            onSubmitReply={() => handleReply(comment.id)}
            onLike={() => handleLike(comment.id)}
            isLiked={likedComments.has(comment.id)}
          />
        ))}
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
  onLike: () => void;
  isLiked: boolean;
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
  onLike,
  isLiked,
}) => {
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
              onClick={onLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
              }`}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{comment.likeCount + (isLiked ? 1 : 0)}</span>
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
              {replies.map((reply) => (
                <div key={reply.id} className="flex space-x-2">
                  <Avatar src={reply.userAvatar} name={reply.userName} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-slate-900">{reply.userName}</span>
                      <span className="text-xs text-slate-500">
                        {formatRelativeTime(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{reply.content}</p>
                  </div>
                </div>
              ))}
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
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button variant="ghost" size="sm" onClick={onCancelReply}>
                  取消
                </Button>
                <Button size="sm" onClick={onSubmitReply}>
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
