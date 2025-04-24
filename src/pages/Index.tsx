
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import PenguinMascot from '../components/mascot/PenguinMascot';
import FeatureCard from '../components/ui/FeatureCard';
import MoodTracker from '../components/features/MoodTracker';
import ChatInterface from '../components/features/ChatInterface';
import CrisisSupport from '../components/features/CrisisSupport';
import SelfCareActivities from '../components/features/SelfCareActivities';
import { MessageSquare, BarChart2, AlertCircle, Heart } from 'lucide-react';

const Index = () => {
  const [activeFeature, setActiveFeature] = React.useState<string | null>(null);

  // Helper function to render the active feature
  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'chat':
        return <ChatInterface />;
      case 'mood':
        return <MoodTracker />;
      case 'crisis':
        return <CrisisSupport />;
      case 'selfcare':
        return <SelfCareActivities />;
      default:
        return null;
    }
  };

  return (
    <MainLayout pageTitle="HeadDoWell">
      {activeFeature ? (
        <div className="mb-6">
          <button 
            onClick={() => setActiveFeature(null)} 
            className="mb-4 text-teal flex items-center"
          >
            <span className="mr-1">←</span> Back to Home
          </button>
          {renderActiveFeature()}
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 w-32 h-32 flex items-center justify-center">
              <img 
                src="/lovable-uploads/d7c3a4b7-2864-4a8f-84a7-024a028614d0.png" 
                alt="Wysa Avatar" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">Welcome to HeadDoWell</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              Your personal mental wellness companion. How can we help you today?
            </p>
          </div>

          <div className="bg-white dark:bg-card rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-lightest rounded-full flex items-center justify-center mr-4">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold">93% users find it helpful</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">for stress & anxiety</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <FeatureCard
              title="Chat with Wysa"
              description="Talk about your feelings and get support"
              icon={<div className="flex justify-center"><MessageSquare className="w-6 h-6 text-teal" /></div>}
              onClick={() => setActiveFeature('chat')}
            />
            
            <FeatureCard
              title="Daily Mood Check"
              description="Track how you're feeling today"
              icon={<div className="flex justify-center"><BarChart2 className="w-6 h-6 text-teal" /></div>}
              onClick={() => setActiveFeature('mood')}
            />
            
            <FeatureCard
              title="Crisis Support"
              description="Get immediate help when you need it most"
              icon={<div className="flex justify-center"><AlertCircle className="w-6 h-6 text-emergency" /></div>}
              onClick={() => setActiveFeature('crisis')}
            />
            
            <FeatureCard
              title="Self-Care Activities"
              description="Simple exercises for your wellbeing"
              icon={<div className="flex justify-center"><Heart className="w-6 h-6 text-teal" /></div>}
              onClick={() => setActiveFeature('selfcare')}
            />
          </div>
          
          <div className="bg-blue-lightest rounded-xl p-6 mb-8 text-center">
            <h3 className="font-semibold mb-2">Anonymous & Secure</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your privacy is our priority. All conversations are encrypted and private.
            </p>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/299d5f35-2127-4cdb-84dd-0c97d62a97e5.png" 
                alt="Security illustration" 
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Index;
