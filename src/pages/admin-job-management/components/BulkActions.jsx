import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const bulkActionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'activate', label: 'Activate Jobs' },
    { value: 'deactivate', label: 'Deactivate Jobs' },
    { value: 'delete', label: 'Delete Jobs' },
    { value: 'export', label: 'Export Selected' },
    { value: 'duplicate', label: 'Duplicate Jobs' },
    { value: 'archive', label: 'Archive Jobs' }
  ];

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    
    if (action && ['delete', 'activate', 'deactivate', 'archive']?.includes(action)) {
      setConfirmAction(action);
      setIsConfirmOpen(true);
    } else if (action) {
      onBulkAction(action);
      setSelectedAction('');
    }
  };

  const handleConfirm = () => {
    if (confirmAction) {
      onBulkAction(confirmAction);
      setSelectedAction('');
      setConfirmAction(null);
      setIsConfirmOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedAction('');
    setConfirmAction(null);
    setIsConfirmOpen(false);
  };

  const getActionIcon = (action) => {
    const icons = {
      activate: 'CheckCircle',
      deactivate: 'XCircle',
      delete: 'Trash2',
      export: 'Download',
      duplicate: 'Copy',
      archive: 'Archive'
    };
    return icons?.[action] || 'Settings';
  };

  const getActionMessage = (action) => {
    const messages = {
      activate: `Are you sure you want to activate ${selectedCount} job(s)? This will make them visible to job seekers.`,
      deactivate: `Are you sure you want to deactivate ${selectedCount} job(s)? This will hide them from job seekers.`,
      delete: `Are you sure you want to delete ${selectedCount} job(s)? This action cannot be undone.`,
      archive: `Are you sure you want to archive ${selectedCount} job(s)? Archived jobs can be restored later.`
    };
    return messages?.[action] || '';
  };

  const getActionColor = (action) => {
    const colors = {
      activate: 'success',
      deactivate: 'secondary',
      delete: 'destructive',
      archive: 'warning'
    };
    return colors?.[action] || 'default';
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="font-medium text-foreground">
                {selectedCount} job{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
            >
              Clear Selection
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-48">
              <Select
                options={bulkActionOptions}
                value={selectedAction}
                onChange={handleActionSelect}
                placeholder="Choose action"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 elevation-4 animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                confirmAction === 'delete' ? 'bg-error/10' : 
                confirmAction === 'activate' ? 'bg-success/10' : 
                confirmAction === 'deactivate'? 'bg-secondary/10' : 'bg-warning/10'
              }`}>
                <Icon 
                  name={getActionIcon(confirmAction)} 
                  size={20} 
                  className={
                    confirmAction === 'delete' ? 'text-error' : 
                    confirmAction === 'activate' ? 'text-success' : 
                    confirmAction === 'deactivate'? 'text-secondary' : 'text-warning'
                  }
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Confirm Action
                </h3>
                <p className="text-sm text-text-secondary">
                  This action will affect {selectedCount} job{selectedCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-foreground">
                {getActionMessage(confirmAction)}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant={getActionColor(confirmAction)}
                onClick={handleConfirm}
                iconName={getActionIcon(confirmAction)}
                iconPosition="left"
              >
                {confirmAction === 'delete' ? 'Delete' : 
                 confirmAction === 'activate' ? 'Activate' : 
                 confirmAction === 'deactivate'? 'Deactivate' : 'Archive'} Jobs
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;