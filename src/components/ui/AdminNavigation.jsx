import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { supabase } from '../../lib/supabase';

const AdminNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and analytics'
    },
    {
      label: 'Job Management',
      path: '/admin-job-management',
      icon: 'Briefcase',
      description: 'Manage job postings'
    },
    {
      label: 'Applications',
      path: '/admin-applications',
      icon: 'FileText',
      description: 'Review applications',
      badge: '24'
    },
    {
      label: 'Companies',
      path: '/admin-companies',
      icon: 'Building2',
      description: 'Manage employers'
    },
    {
      label: 'Users',
      path: '/admin-users',
      icon: 'Users',
      description: 'User management'
    },
    {
      label: 'Analytics',
      path: '/admin-analytics',
      icon: 'BarChart3',
      description: 'Performance metrics'
    },
    {
      label: 'Settings',
      path: '/admin-settings',
      icon: 'Settings',
      description: 'System configuration'
    }
  ];

  const quickActions = [
    { label: 'New Job Post', icon: 'Plus', action: 'create-job' },
    { label: 'Export Data', icon: 'Download', action: 'export' },
    { label: 'Send Newsletter', icon: 'Mail', action: 'newsletter' }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-job':
        // Navigate to job creation
        break;
      case 'export':
        // Trigger export
        break;
      case 'newsletter':
        // Open newsletter composer
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      // Still navigate to home even if there's an error
      navigate('/');
    }
  };

  return (
    <aside className={`fixed left-0 top-0 bottom-0 bg-surface border-r border-border z-50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/admin-dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">Admin Panel</span>
                <p className="text-xs text-text-secondary">JobBoard Pro</p>
              </div>
            </Link>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 p-3 rounded-md transition-micro group relative ${
                  location.pathname === item?.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
                title={isCollapsed ? item?.label : ''}
              >
                <Icon name={item?.icon} size={20} />
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{item?.label}</div>
                      <div className="text-xs opacity-75">{item?.description}</div>
                    </div>
                    
                    {item?.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        location.pathname === item?.path
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        {item?.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-60">
                    {item?.label}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions?.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction(action?.action)}
                  iconName={action?.icon}
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Admin User</div>
                  <div className="text-xs text-text-secondary">admin@jobboard.pro</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Settings"
                  className="flex-1"
                >
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="LogOut"
                  onClick={handleLogout}
                  className="flex-1"
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                className="w-full p-2 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro group relative"
                title="Profile"
              >
                <Icon name="User" size={20} />
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-60">
                  Profile
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="w-full p-2 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro group relative"
                title="Logout"
              >
                <Icon name="LogOut" size={20} />
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-60">
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminNavigation;