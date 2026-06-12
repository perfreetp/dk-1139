import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Check, Clock } from 'lucide-react';
import { useStore } from '../../store';
import { formatRelativeTime } from '../../utils/formatDate';
import { Badge, Button } from '../base';

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount } = useStore();
  const unreadCount = getUnreadNotificationCount();

  const handleNotificationClick = (notificationId: string, entryId: string) => {
    markNotificationRead(notificationId);
    setIsOpen(false);
    window.location.href = `/entry/${entryId}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <MessageCircle size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-[32rem] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">消息通知</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                  <Check size={14} className="mr-1" />
                  全部已读
                </Button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[24rem]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                  <p>暂无消息通知</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id, notification.entryId)}
                      className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.type === 'reply' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {notification.type === 'reply' ? (
                            <MessageCircle size={20} />
                          ) : (
                            <Heart size={20} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-slate-900">
                              {notification.fromUserName}
                            </span>
                            {notification.type === 'reply' ? (
                              <Badge variant="primary" size="sm">回复了你</Badge>
                            ) : (
                              <Badge variant="danger" size="sm">赞了你</Badge>
                            )}
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            在「{notification.entryTitle}」中
                          </p>
                          <p className="text-sm text-slate-700 line-clamp-2 bg-white p-2 rounded border">
                            {notification.commentContent}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                            <Clock size={12} className="mr-1" />
                            {formatRelativeTime(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
