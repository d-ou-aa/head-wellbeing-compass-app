
import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ChatContextProvider } from './context';
import { Card } from '@/components/ui/card';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar';
import ChatHistory from '../../features/ChatHistory';
import { MessageSquare } from 'lucide-react';
import { Message } from './types';

interface ChatContainerProps {
  historyMessages?: Message[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ historyMessages = [] }) => {
  return (
    <>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Chat History</h3>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ChatHistory messages={historyMessages} />
        </SidebarContent>
      </Sidebar>

      <Card className="h-[calc(100vh-160px)] flex flex-col bg-white dark:bg-card rounded-lg shadow-sm ml-0 w-full">
        <div className="bg-teal p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="/lovable-uploads/d7c3a4b7-2864-4a8f-84a7-024a028614d0.png" 
                alt="HeadDoWell Avatar" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="ml-3">
              <h2 className="font-medium text-white">Chat with HeadDoWell</h2>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <SidebarTrigger />
        </div>
        <ChatContextProvider>
          <ChatMessages />
          <ChatInput />
        </ChatContextProvider>
      </Card>
    </>
  );
};

export default ChatContainer;
