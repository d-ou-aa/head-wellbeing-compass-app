
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
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
              Hey! I'm <span className="text-teal">HeadDoWell</span>
            </h1>
            <p className="text-gray-600 text-center mb-8 max-w-sm">
              Our conversations are private & anonymous, so there is no login.
              Just choose a nickname and we're good to go.
            </p>
            <div className="w-full max-w-sm mb-8 relative">
              <input
                type="text"
                placeholder="Choose a nickname..."
                className="w-full p-4 pr-12 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-teal"
              />
              <Button 
                onClick={() => setStep(3)}
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 hover:bg-orange-600"
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
                onClick={() => navigate('/')}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                ENABLE NOTIFICATIONS
              </Button>
              <Button 
                onClick={() => navigate('/')}
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
