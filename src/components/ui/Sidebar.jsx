import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
// import logo from "../assets/images/logo.png";

const Sidebar = ({ userRole = 'worker', isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        path: userRole === 'worker' ? '/worker-dashboard-form-selection' : 
              userRole === 'supervisor'? '/supervisor-dashboard-approval-queue' : '/safety-analytics-reporting-dashboard',
        icon: 'LayoutDashboard',
        roles: ['worker', 'supervisor', 'admin']
      }
    ];

    const roleSpecificItems = {
      worker: [
        {
          label: 'Safety Forms',
          path: '/pre-job-safety-survey-form',
          icon: 'FileText',
          roles: ['worker']
        },
        {
          label: 'Hot Work Permit',
          path: '/hot-work-permit',
          icon: 'FileText',
          roles: ['worker']
        },
        {
          label: 'Electrical Pass',
          path: '/electrical-pass',
          icon: 'FileText',
          roles: ['worker']
        }

      ],
      supervisor: [
        {
          label: 'Safety Forms',
          path: '/pre-job-safety-survey-form',
          icon: 'FileText',
          roles: ['supervisor', 'admin']
        },
        {
          label: 'Approvals',
          path: '/supervisor-dashboard-approval-queue',
          icon: 'CheckCircle',
          roles: ['supervisor', 'admin'],
          badge: 5
        },
        {
          label: 'Data Management',
          path: '/form-data-management-search',
          icon: 'Database',
          roles: ['supervisor', 'admin']
        }
      ],
      admin: [
        {
          label: 'Safety Forms',
          path: '/pre-job-safety-survey-form',
          icon: 'FileText',
          roles: ['admin']
        },
        {
          label: 'Approvals',
          path: '/supervisor-dashboard-approval-queue',
          icon: 'CheckCircle',
          roles: ['admin'],
          badge: 5
        },
        {
          label: 'Data Management',
          path: '/form-data-management-search',
          icon: 'Database',
          roles: ['admin']
        },
        {
          label: 'Analytics',
          path: '/safety-analytics-reporting-dashboard',
          icon: 'BarChart3',
          roles: ['admin']
        }
      ]
    };

    return [...baseItems, ...(roleSpecificItems?.[userRole] || [])];
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location?.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event?.target?.closest('.sidebar-container')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-6'} py-4 border-b border-border`}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            
           
<div className="w-8 h-8 rounded-lg flex items-center justify-center">
  <img
     src="/assets/images/logo.png"
    alt="Logo"
    className="w-8 h-8 rounded-lg"
  />
</div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Aspen planers</h2>
              <p className="text-xs text-muted-foreground">Safety Reporter</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
  <img
     src="/assets/images/logo.png"
    alt="Logo"
    className="w-8 h-8 rounded-lg"
  />
</div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems?.map((item) => (
          <button
            key={item?.path}
            onClick={() => handleNavigation(item?.path)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-lg industrial-transition group ${
              isActiveRoute(item?.path)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title={isCollapsed ? item?.label : undefined}
          >
            <Icon name={item?.icon} size={20} />
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium">{item?.label}</span>
                {item?.badge && (
                  <span className="ml-auto bg-error text-error-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item?.badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* User Context Section */}
      <div className={`border-t border-border p-4 ${isCollapsed ? 'text-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Icon name="User" size={16} className="text-accent-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground capitalize">{userRole}</p>
              <p className="text-xs text-muted-foreground">Shift A - Day</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle (Desktop) */}
      {onToggleCollapse && (
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full"
            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
            iconPosition="left"
          >
            {!isCollapsed && "Collapse"}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Icon name={isMobileOpen ? "X" : "Menu"} size={24} />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-100" />
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-100 bg-card border-r border-border industrial-shadow transition-all duration-200 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-60'
      }`}>
        <div className="sidebar-container w-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-200 w-60 bg-card border-r border-border industrial-shadow transform transition-transform duration-200 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="sidebar-container">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;