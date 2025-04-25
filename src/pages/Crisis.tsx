
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Phone, MessageSquare, Users, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Crisis = () => {
  const emergencyResources = [
    {
      title: 'National Suicide Prevention Lifeline',
      description: 'Available 24/7',
      icon: <Phone className="w-5 h-5" />,
      contact: '988',
      buttonText: 'Call Now',
      isPrimary: true
    },
    {
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741',
      icon: <MessageSquare className="w-5 h-5" />,
      contact: 'HOME to 741741',
      buttonText: 'Text Now',
      isPrimary: false
    },
    {
      title: 'Local Emergency Services',
      description: 'For immediate danger',
      icon: <MapPin className="w-5 h-5" />,
      contact: '911',
      buttonText: 'Call 911',
      isPrimary: true
    },
    {
      title: 'Find Local Support Groups',
      description: 'Connect with others',
      icon: <Users className="w-5 h-5" />,
      contact: '',
      buttonText: 'Find Support',
      isPrimary: false
    }
  ];

  const handleContactAction = (resource: any) => {
    if (resource.contact.includes('988')) {
      window.location.href = `tel:988`;
    } else if (resource.contact.includes('911')) {
      window.location.href = `tel:911`;
    }
  };

  return (
    <MainLayout pageTitle="Crisis Support">
      <div className="space-y-6">
        <div className="bg-emergency/10 p-4 rounded-lg border border-emergency mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emergency/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-emergency" />
            </div>
            <div>
              <h3 className="font-medium text-emergency">In an emergency?</h3>
              <p className="text-sm mt-1">
                If you or someone you know is in immediate danger, please contact emergency services right away using the resources below.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {emergencyResources.map((resource, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${resource.isPrimary ? 'bg-emergency/20' : 'bg-teal/10'} flex items-center justify-center flex-shrink-0`}>
                  {resource.icon}
                </div>
                <div>
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                </div>
              </div>
              <Button 
                className={resource.isPrimary ? "w-full bg-emergency hover:bg-emergency/90" : "w-full"}
                onClick={() => handleContactAction(resource)}
              >
                {resource.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        <div className="bg-blue-lightest p-4 rounded-lg mt-6">
          <h3 className="font-medium mb-2">Remember</h3>
          <p className="text-sm text-gray-600">
            It's okay to ask for help. These resources are available 24/7 and staffed by trained counselors who care about your wellbeing.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Crisis;
