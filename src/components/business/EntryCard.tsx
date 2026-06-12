import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, MessageCircle, Clock, User } from 'lucide-react';
import { Entry } from '../../types';
import { Card, Tag, Avatar } from '../base';
import { formatRelativeTime } from '../../utils/formatDate';
import { useStore } from '../../store';
import { Heart as HeartFilled } from 'lucide-react';

interface EntryCardProps {
  entry: Entry;
  showAuthor?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, showAuthor = true }) => {
  const { toggleFavorite, isFavorite } = useStore();
  const isFav = isFavorite(entry.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(entry.id);
  };

  return (
    <Link to={`/entry/${entry.id}`}>
      <Card hover className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {entry.isOfficial && (
                  <Tag variant="primary" size="sm">官方</Tag>
                )}
                {entry.status === 'pending' && (
                  <Tag variant="warning" size="sm">待审核</Tag>
                )}
                {entry.status === 'draft' && (
                  <Tag variant="default" size="sm">草稿</Tag>
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-700 transition-colors line-clamp-2">
                {entry.title}
              </h3>
            </div>
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-all ${
                isFav
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
              }`}
            >
              {isFav ? <HeartFilled size={18} /> : <Heart size={18} />}
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3">
            {entry.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {entry.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} variant="default" size="sm">
                {tag}
              </Tag>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {entry.viewCount}
              </span>
              <span className="flex items-center">
                <Heart size={14} className="mr-1" />
                {entry.favoriteCount + (isFav ? 1 : 0)}
              </span>
              <span className="flex items-center">
                <MessageCircle size={14} className="mr-1" />
                {entry.commentCount}
              </span>
            </div>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {formatRelativeTime(entry.updatedAt)}
            </span>
          </div>

          {showAuthor && (
            <div className="flex items-center mt-3 pt-3 border-t border-slate-100">
              <Avatar src="" name={entry.authorName} size="sm" />
              <span className="ml-2 text-sm text-slate-600">{entry.authorName}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
