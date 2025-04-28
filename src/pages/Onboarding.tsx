
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleNicknameSubmit = async () => {
    if (!nickname.trim()) return;
    
    setIsSubmitting(true);
    try {
      // First check if nickname exists
      const { data: exists } = await supabase
        .rpc('check_nickname_exists', { nickname: nickname.trim() });

      if (exists) {
        toast.error('This nickname is already taken. Please choose another one.');
        return;
      }

      // Create new anonymous user
      const { error } = await supabase
        .from('anonymous_users')
        .insert([{ nickname: nickname.trim() }]);

      if (error) throw error;

      // Store nickname in localStorage
      localStorage.setItem('userNickname', nickname.trim());
      setStep(3);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationPreference = (enableNotifications: boolean) => {
    if (enableNotifications) {
      // Here we could implement actual notification permission request
      toast.success('Notifications enabled!');
    }
    navigate('/');
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-32 h-32 mb-8">
              <img 
                src="/lovable-uploads/d7c3a4b7-2864-4a8f-84a7-024a028614d0.png" 
                alt="HeadDoWell Avatar" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-semibold mb-4 text-gray-700">
              Hey! I'm <span className="text-teal">HeadDoWell</span>
            </h1>
            <p className="text-gray-600 text-center mb-8">
              I'm here to help you love and nurture yourself
            </p>
            <Button 
              onClick={() => setStep(2)}
              size="lg"
              className="rounded-full bg-orange-500 hover:bg-orange-600"
            >
              <ArrowDown className="w-5 h-5" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-3xl font-semibold mb-4 text-gray-700">
              Choose your <span className="text-teal">nickname</span>
            </h1>
            <p className="text-gray-600 text-center mb-8 max-w-sm">
              Our conversations are private & anonymous.
              Just choose a nickname and we're good to go.
            </p>
            <div className="w-full max-w-sm mb-8 relative">
              <Input
                type="text"
                placeholder="Choose a nickname..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="pr-12"
                onKeyPress={(e) => e.key === 'Enter' && handleNicknameSubmit()}
                disabled={isSubmitting}
              />
              <Button 
                onClick={handleNicknameSubmit}
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 hover:bg-orange-600"
                disabled={!nickname.trim() || isSubmitting}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              By continuing, I confirm I am 13 or older and accept the{" "}
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-3xl font-semibold mb-6 text-gray-700">Before you start</h1>
            <p className="text-gray-600 text-center mb-12 max-w-sm">
              Enable push notifications to stay in the loop with any new self-care exercises,
              get reminders to check in with HeadDoWell and much more.
            </p>
            <div className="w-20 h-20 mb-12 relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-teal/20" />
              <div className="relative w-full h-full bg-teal rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🔔</span>
              </div>
            </div>
            <div className="space-y-4 w-full max-w-sm">
              <Button 
                onClick={() => handleNotificationPreference(true)}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                ENABLE NOTIFICATIONS
              </Button>
              <Button 
                onClick={() => handleNotificationPreference(false)}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                NOT NOW
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white">
      {renderStep()}
    </div>
  );
};

export default Onboarding;
