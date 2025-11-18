import React from 'react';
import Icon from '../../../components/AppIcon';

const FormHeader = ({ 
  formType = 'operational', 
  progress = 0, 
  autoSaveStatus = 'saved',
  onFormTypeChange 
}) => {
  const getFormTypeColor = () => {
    return formType === 'operational' ? 'bg-green-600' : 'bg-orange-600';
  };

  const getAutoSaveIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'Loader2';
      case 'saved':
        return 'Check';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Clock';
    }
  };

  const getAutoSaveText = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'All changes saved';
      case 'error':
        return 'Save failed - retry';
      default:
        return 'Auto-save enabled';
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Pre-Job Safety Survey</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onFormTypeChange('operational')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formType === 'operational' ?'bg-green-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon name="Wrench" size={16} className="inline mr-2" />
                Operational
              </button>
              <button
                onClick={() => onFormTypeChange('maintenance')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formType === 'maintenance' ?'bg-orange-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon name="Settings" size={16} className="inline mr-2" />
                Maintenance
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Icon 
                name={getAutoSaveIcon()} 
                size={16} 
                className={`${autoSaveStatus === 'saving' ? 'animate-spin' : ''} ${
                  autoSaveStatus === 'error' ? 'text-red-500' : 'text-green-500'
                }`}
              />
              <span>{getAutoSaveText()}</span>
            </div>
            <div className="text-sm text-gray-500">
              Form ID: ASPEN-{new Date()?.getFullYear()}-{String(Math.floor(Math.random() * 10000))?.padStart(4, '0')}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Form Completion</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getFormTypeColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;