import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationBadge = ({ notifications, onDismiss }) => {
  if (!notifications || notifications?.length === 0) return null;

  return (
    <div className="space-y-3">
      {notifications?.map((notification) => (
        <div
          key={notification?.id}
          className={`p-4 rounded-lg border-l-4 ${
            notification?.type === 'feedback' ?'bg-accent/5 border-accent' 
              : notification?.type === 'update' ?'bg-warning/5 border-warning' :'bg-success/5 border-success'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Icon 
                name={
                  notification?.type === 'feedback' ? 'MessageSquare' :
                  notification?.type === 'update' ? 'AlertCircle' : 'CheckCircle'
                } 
                size={16} 
                className={
                  notification?.type === 'feedback' ? 'text-accent' :
                  notification?.type === 'update' ? 'text-warning' : 'text-success'
                }
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {notification?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification?.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {notification?.timestamp}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDismiss(notification?.id)}
              className="text-muted-foreground hover:text-foreground industrial-transition"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationBadge;