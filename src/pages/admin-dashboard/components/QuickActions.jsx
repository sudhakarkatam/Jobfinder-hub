import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'create-job',
      title: 'Create New Job',
      description: 'Post a new job listing',
      icon: 'Plus',
      variant: 'default',
      onClick: () => navigate('/admin-job-management')
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: 'Users',
      variant: 'outline',
      onClick: () => console.log('Navigate to user management')
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Access analytics and reports',
      icon: 'BarChart3',
      variant: 'outline',
      onClick: () => console.log('Navigate to reports')
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: 'Settings',
      variant: 'outline',
      onClick: () => console.log('Navigate to settings')
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <div key={action?.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-micro">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName={action?.icon}
                  onClick={action?.onClick}
                  className="w-full h-full"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground mb-1">{action?.title}</h3>
                <p className="text-xs text-text-secondary">{action?.description}</p>
                
                <Button
                  variant={action?.variant}
                  size="sm"
                  onClick={action?.onClick}
                  className="mt-3 w-full"
                >
                  {action?.title}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;