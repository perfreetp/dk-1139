import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pin, AlertCircle } from 'lucide-react';
import { Announcement } from '../../types';
import { Badge } from '../base';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pinnedAnnouncements = announcements
    .filter(ann => ann.isPinned)
    .sort((a, b) => (a.pinOrder || 0) - (b.pinOrder || 0));

  useEffect(() => {
    if (pinnedAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pinnedAnnouncements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [pinnedAnnouncements.length]);

  if (pinnedAnnouncements.length === 0) return null;

  const currentAnnouncement = pinnedAnnouncements[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? pinnedAnnouncements.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pinnedAnnouncements.length);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle size={16} />;
      case 'high':
        return <Pin size={16} />;
      default:
        return <Pin size={16} />;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0">
            <Badge variant={getPriorityVariant(currentAnnouncement.priority)}>
              {getPriorityIcon(currentAnnouncement.priority)}
              <span className="ml-1">
                {currentAnnouncement.priority === 'urgent'
                  ? '紧急'
                  : currentAnnouncement.priority === 'high'
                  ? '重要'
                  : '通知'}
              </span>
            </Badge>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {currentAnnouncement.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {currentAnnouncement.content}
            </p>
          </div>

          {pinnedAnnouncements.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg hover:bg-amber-200/50 transition-colors"
              >
                <ChevronLeft size={20} className="text-amber-700" />
              </button>
              <span className="text-sm text-amber-700 font-medium min-w-[3rem] text-center">
                {currentIndex + 1}/{pinnedAnnouncements.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg hover:bg-amber-200/50 transition-colors"
              >
                <ChevronRight size={20} className="text-amber-700" />
              </button>
            </div>
          )}
        </div>
      </div>

      {pinnedAnnouncements.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {pinnedAnnouncements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-amber-600 w-6'
                  : 'bg-amber-300 hover:bg-amber-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
