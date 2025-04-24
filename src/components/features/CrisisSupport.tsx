
import React from 'react';
import { Phone, Users, MessageSquare } from 'lucide-react';

const CrisisSupport = () => {
  const emergencyOptions = [
    {
      title: 'Crisis Hotline',
      description: '24/7 confidential support',
      icon: <Phone className="w-5 h-5" />,
      action: '988',
      type: 'phone'
    },
    {
      title: 'Text Support Line',
      description: 'Text HOME to 741741',
      icon: <MessageSquare className="w-5 h-5" />,
      action: 'HOME to 741741',
      type: 'text'
    },
    {
      title: 'Local Support',
      description: 'Find help near you',
      icon: <Users className="w-5 h-5" />,
      action: '/resources',
      type: 'link'
    }
  ];

  const handleEmergencyAction = (option: typeof emergencyOptions[0]) => {
    if (option.type === 'phone') {
      window.location.href = `tel:${option.action}`;
    } else if (option.type === 'text') {
      alert(`To get text support: Send ${option.action}`);
    }
    // Links will be handled by the router
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg p-5 shadow-sm border border-emergency/20">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-emergency">Crisis Support</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Need immediate help? These resources are available 24/7.
        </p>
      </div>

      <div className="space-y-3">
        {emergencyOptions.map((option, index) => (
          <button 
            key={index}
            className="crisis-button"
            onClick={() => handleEmergencyAction(option)}
          >
            <div className="w-10 h-10 bg-emergency/20 rounded-full flex items-center justify-center mr-3">
              {option.icon}
            </div>
            <div className="text-left">
              <h4 className="font-medium">{option.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          If you or someone you know is in immediate danger, please call emergency services (911) right away.
        </p>
      </div>
    </div>
  );
};

export default CrisisSupport;
