
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Notifications = () => {
  return (
    <MainLayout pageTitle="Notifications">
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Daily Check-in Reminders</h3>
                <p className="text-sm text-gray-500">Receive daily reminders to log your mood</p>
              </div>
              <Switch id="daily-reminder" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Chat Notifications</h3>
                <p className="text-sm text-gray-500">Get notified about new messages</p>
              </div>
              <Switch id="chat-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Weekly Progress Report</h3>
                <p className="text-sm text-gray-500">Receive weekly summary of your mental wellness</p>
              </div>
              <Switch id="weekly-report" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">New Resources Alert</h3>
                <p className="text-sm text-gray-500">Be notified when new mental health resources are added</p>
              </div>
              <Switch id="new-resources" defaultChecked />
            </div>
          </div>
        </Card>
        
        <p className="text-center text-sm text-gray-500">
          You can change these settings anytime from your profile.
        </p>
      </div>
    </MainLayout>
  );
};

export default Notifications;
