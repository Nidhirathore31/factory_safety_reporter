import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'worker', userName = 'John Doe', factoryName = 'Aspen planers ltd. - Plant A', isOffline = false }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, type: 'approval', message: 'Safety form requires approval', time: '5 min ago' },
    { id: 2, type: 'alert', message: 'System maintenance scheduled', time: '1 hour ago' },
  ];

  const handleLogout = () => {
    // Clear any stored form data
    localStorage.removeItem('tolko-safety-form');
    
    // Clear any other session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Close user menu
    setShowUserMenu(false);
    
    // Navigate to login page
    navigate('/factory-landing-authentication');
    
    console.log('User logged out successfully');
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      worker: 'Factory Worker',
      supervisor: 'Supervisor',
      admin: 'Administrator'
    };
    return roleMap?.[role] || 'User';
  };

  return (
    <header className="bg-card border-b border-border industrial-shadow sticky top-0 z-100">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Factory Name and Status */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">{factoryName}</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-warning' : 'bg-success'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isOffline ? 'Offline Mode' : 'Connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions based on role */}
          {userRole === 'worker' && (
            <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
              New Report
            </Button>
          )}
          
          {userRole === 'supervisor' && (
            <Button variant="outline" size="sm" iconName="CheckCircle" iconPosition="left">
              Approve Forms
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {notifications?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications?.length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg industrial-shadow z-300">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div key={notification?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted industrial-transition">
                      <div className="flex items-start space-x-3">
                        <Icon 
                          name={notification?.type === 'approval' ? 'Clock' : 'AlertTriangle'} 
                          size={16} 
                          className={notification?.type === 'approval' ? 'text-warning' : 'text-error'} 
                        />
                        <div className="flex-1">
                          <p className="text-sm text-popover-foreground">{notification?.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {userName?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplayName(userRole)}</p>
              </div>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg industrial-shadow z-300">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-popover-foreground">{userName}</p>
                  <p className="text-sm text-muted-foreground">{getRoleDisplayName(userRole)}</p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted industrial-transition flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted industrial-transition flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted industrial-transition flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help</span>
                  </button>
                  <div className="border-t border-border mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted industrial-transition flex items-center space-x-2"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside handlers */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;