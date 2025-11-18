import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const mockNotifications = [
    {
      id: 'n1',
      type: 'new_submission',
      title: 'New Safety Form Submitted',
      message: 'Mike Johnson submitted a high-priority operational safety form',
      formId: 'SF-2025-001',
      timestamp: new Date('2025-01-08T14:30:00'),
      priority: 'high',
      read: false,
      actions: ['view', 'approve', 'dismiss']
    },
    {
      id: 'n2',
      type: 'overdue_alert',
      title: 'Form Overdue',
      message: 'Safety form SF-2025-003 is now overdue for approval',
      formId: 'SF-2025-003',
      timestamp: new Date('2025-01-08T13:00:00'),
      priority: 'critical',
      read: false,
      actions: ['view', 'approve', 'reassign']
    },
    {
      id: 'n3',
      type: 'sla_warning',
      title: 'SLA Warning',
      message: '3 forms will breach SLA in the next hour',
      timestamp: new Date('2025-01-08T12:45:00'),
      priority: 'medium',
      read: true,
      actions: ['view_list', 'dismiss']
    },
    {
      id: 'n4',
      type: 'system_update',
      title: 'System Maintenance',
      message: 'Scheduled maintenance window: Tonight 11 PM - 1 AM',
      timestamp: new Date('2025-01-08T10:00:00'),
      priority: 'low',
      read: true,
      actions: ['dismiss']
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification = {
        id: `n${Date.now()}`,
        type: 'new_submission',
        title: 'New Safety Form Submitted',
        message: `${['Sarah Chen', 'David Rodriguez', 'Maria Garcia']?.[Math.floor(Math.random() * 3)]} submitted a safety form`,
        formId: `SF-2025-${String(Math.floor(Math.random() * 999))?.padStart(3, '0')}`,
        timestamp: new Date(),
        priority: ['high', 'medium', 'low']?.[Math.floor(Math.random() * 3)],
        read: false,
        actions: ['view', 'approve', 'dismiss']
      };
      
      setNotifications(prev => [newNotification, ...prev?.slice(0, 9)]);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_submission': return 'FileText';
      case 'overdue_alert': return 'AlertTriangle';
      case 'sla_warning': return 'Clock';
      case 'system_update': return 'Settings';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationAction = (notification, action) => {
    switch (action) {
      case 'view':
        onNotificationClick(notification?.formId);
        break;
      case 'approve':
        // Handle quick approve
        console.log('Quick approve:', notification?.formId);
        break;
      case 'dismiss':
        setNotifications(prev => prev?.filter(n => n?.id !== notification?.id));
        break;
      case 'reassign':
        // Handle reassign
        console.log('Reassign:', notification?.formId);
        break;
      case 'view_list':
        // Handle view list
        console.log('View list');
        break;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => n?.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <>
      {/* Floating Notification Toast */}
      {isVisible && notifications?.length > 0 && !notifications?.[0]?.read && (
        <div className="fixed top-20 right-6 z-300 bg-card border border-border rounded-lg industrial-shadow p-4 max-w-sm animate-slide-in">
          <div className="flex items-start space-x-3">
            <Icon 
              name={getNotificationIcon(notifications?.[0]?.type)} 
              size={20} 
              className={getNotificationColor(notifications?.[0]?.priority)} 
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">{notifications?.[0]?.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{notifications?.[0]?.message}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  size="xs"
                  onClick={() => handleNotificationAction(notifications?.[0], 'view')}
                >
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="xs"
                  onClick={() => setIsVisible(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Notification Panel */}
      <div className="bg-card border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-error text-error-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll} iconName="Trash2">
                Clear All
              </Button>
            </div>
          </div>

        
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications?.map((notification) => (
                <div
                  key={notification?.id}
                  className={`p-3 rounded-lg border industrial-transition cursor-pointer ${
                    notification?.read 
                      ? 'bg-muted border-border opacity-75' :'bg-card border-accent hover:bg-accent/5'
                  }`}
                  onClick={() => markAsRead(notification?.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={getNotificationIcon(notification?.type)} 
                      size={18} 
                      className={getNotificationColor(notification?.priority)} 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {notification?.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(notification?.priority)}`}>
                          {notification?.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification?.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification?.timestamp)}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          {notification?.actions?.map((action) => (
                            <Button
                              key={action}
                              variant="ghost"
                              size="xs"
                              onClick={(e) => {
                                e?.stopPropagation();
                                handleNotificationAction(notification, action);
                              }}
                            >
                              {action === 'view' && 'View'}
                              {action === 'approve' && 'Approve'}
                              {action === 'dismiss' && 'Dismiss'}
                              {action === 'reassign' && 'Reassign'}
                              {action === 'view_list' && 'View List'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;