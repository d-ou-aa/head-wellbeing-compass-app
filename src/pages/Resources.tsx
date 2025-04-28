
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { BookOpen, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Resources = () => {
  const navigate = useNavigate();
  
  const resources = [
    {
      id: 1,
      title: 'Mindfulness Guide',
      description: 'Learn the basics of mindfulness meditation',
      icon: BookOpen,
      category: 'Guide',
      path: '/mindfulness'
    },
    {
      id: 2,
      title: 'Stress Management Tips',
      description: 'Practical techniques for managing daily stress',
      icon: FileText,
      category: 'Article',
      path: '/stress-management'
    },
    {
      id: 3,
      title: 'Community Support',
      description: 'Connect with others on your wellness journey',
      icon: MessageSquare,
      category: 'Community',
      path: '/community'
    }
  ];

  const handleResourceClick = (resource: typeof resources[0]) => {
    // For now, show a toast with the resource information
    // In a full implementation, these would navigate to actual pages
    toast({
      title: resource.title,
      description: `You selected: ${resource.description}`,
      duration: 3000,
    });
    
    // Only navigate to chat for the Community option
    if (resource.category === 'Community') {
      navigate('/chat');
    }
  };

  return (
    <MainLayout pageTitle="Resources">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-dark mb-2">Wellness Resources</h2>
          <p className="text-gray-600">Explore our collection of mental wellness resources</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {resources.map(resource => (
            <Card 
              key={resource.id} 
              className="p-4 hover:border-teal/20 transition-colors cursor-pointer"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center">
                  <resource.icon className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-xs">
                      {resource.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
