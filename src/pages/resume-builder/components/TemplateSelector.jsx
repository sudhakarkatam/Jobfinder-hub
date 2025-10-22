import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateSelector = ({ selectedTemplate, onSelectTemplate, onClose }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design',
      preview: {
        name: 'JOHN DOE',
        title: 'Software Engineer',
        style: 'modern'
      },
      color: 'blue'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional business layout',
      preview: {
        name: 'JOHN DOE',
        title: 'Software Engineer',
        style: 'classic'
      },
      color: 'gray'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Stand out with unique design',
      preview: {
        name: 'JOHN DOE',
        title: 'Software Engineer',
        style: 'creative'
      },
      color: 'purple'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant',
      preview: {
        name: 'JOHN DOE',
        title: 'Software Engineer',
        style: 'minimal'
      },
      color: 'green'
    }
  ];

  const renderTemplatePreview = (template) => {
    const { style } = template.preview;
    
    return (
      <div className={`w-full h-32 border rounded-lg p-4 ${getTemplateStyles(style)}`}>
        <div className="text-center">
          <div className={`font-bold mb-1 ${getTemplateNameStyles(style)}`}>
            {template.preview.name}
          </div>
          <div className={`text-sm ${getTemplateTitleStyles(style)}`}>
            {template.preview.title}
          </div>
        </div>
      </div>
    );
  };

  const getTemplateStyles = (style) => {
    switch (style) {
      case 'modern':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      case 'classic':
        return 'bg-gray-50 border-gray-200';
      case 'creative':
        return 'bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200';
      case 'minimal':
        return 'bg-white border-gray-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getTemplateNameStyles = (style) => {
    switch (style) {
      case 'modern':
        return 'text-blue-900 text-lg';
      case 'classic':
        return 'text-gray-900 text-lg';
      case 'creative':
        return 'text-purple-900 text-lg';
      case 'minimal':
        return 'text-gray-900 text-lg';
      default:
        return 'text-gray-900 text-lg';
    }
  };

  const getTemplateTitleStyles = (style) => {
    switch (style) {
      case 'modern':
        return 'text-blue-700';
      case 'classic':
        return 'text-gray-600';
      case 'creative':
        return 'text-purple-700';
      case 'minimal':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Choose Template</h2>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Template Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onSelectTemplate(template.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Icon name="Check" size={16} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Template Preview */}
                {renderTemplatePreview(template)}

                {/* Template Features */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Icon name="CheckCircle" size={16} className="text-green-500" />
                    <span>Professional layout</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Icon name="CheckCircle" size={16} className="text-green-500" />
                    <span>ATS friendly</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Icon name="CheckCircle" size={16} className="text-green-500" />
                    <span>Print ready</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSelectTemplate(selectedTemplate)}>
            Apply Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector; 