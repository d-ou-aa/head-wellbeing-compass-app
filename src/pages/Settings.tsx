
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell,
  Moon,
  Volume2,
  ShieldCheck,
  HelpCircle,
  Info,
  FileText
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { userPreferences, updatePreference } = useTheme();

  const handleClearData = () => {
    localStorage.removeItem('chatHistory');
    toast({
      title: 'Data cleared',
      description: 'All your chat history has been deleted.',
      variant: 'default',
    });
  };

  return (
    <MainLayout pageTitle="Settings">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">App Settings</h2>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-teal" />
                </div>
                <Label htmlFor="daily-reminders">Daily check-in reminders</Label>
              </div>
              <Switch 
                id="daily-reminders" 
                checked={userPreferences.dailyReminders}
                onCheckedChange={(checked) => updatePreference('dailyReminders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-teal" />
                </div>
                <Label htmlFor="activity-notifications">Activity suggestions</Label>
              </div>
              <Switch 
                id="activity-notifications" 
                checked={userPreferences.activitySuggestions}
                onCheckedChange={(checked) => updatePreference('activitySuggestions', checked)}
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                <Moon className="w-4 h-4 text-teal" />
              </div>
              <Label htmlFor="dark-mode">Dark mode</Label>
            </div>
            <Switch 
              id="dark-mode" 
              checked={userPreferences.darkMode}
              onCheckedChange={(checked) => updatePreference('darkMode', checked)}
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-3">Sound</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-teal" />
              </div>
              <Label htmlFor="sound-effects">Sound effects</Label>
            </div>
            <Switch 
              id="sound-effects" 
              checked={userPreferences.soundEffects}
              onCheckedChange={(checked) => updatePreference('soundEffects', checked)}
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-3">Privacy & Security</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-teal" />
                </div>
                <Label htmlFor="data-collection">Data collection</Label>
              </div>
              <Switch 
                id="data-collection" 
                checked={userPreferences.dataCollection}
                onCheckedChange={(checked) => updatePreference('dataCollection', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <Label htmlFor="clear-data">Clear app data</Label>
                  <p className="text-xs text-gray-500">Delete all your journal entries and conversations</p>
                </div>
              </div>
              <button 
                className="text-sm text-red-500 font-medium"
                onClick={handleClearData}
              >
                Clear
              </button>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-3">Support</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-teal" />
                </div>
                <span>Help Center</span>
              </div>
              <div className="text-teal">→</div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  <Info className="w-4 h-4 text-teal" />
                </div>
                <span>About HeadDoWell</span>
              </div>
              <div className="text-teal">→</div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-teal" />
                </div>
                <span>Terms & Privacy Policy</span>
              </div>
              <div className="text-teal">→</div>
            </div>
          </div>
        </Card>
        
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>App version 1.0.0</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
