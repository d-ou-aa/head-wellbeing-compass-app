
import React from 'react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useChatContext } from './ChatContext';

const emojis = [
  '😊', '😃', '😄', '😁', '😆', '😅', '🥰', '😇', 
  '😉', '😌', '😍', '🤗', '🤔', '🤨', '😐', '😑',
  '😶', '🙄', '😏', '😣', '😥', '😮', '😯', '😪',
  '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓',
  '😔', '😕', '🙃', '🤑', '😲', '☹️', '😖', '😞',
  '😤', '😢', '😭', '😧', '😩', '😰', '😱', '🥵'
];

const EmojiPicker = () => {
  const { addEmoji } = useChatContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
              onClick={() => addEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
