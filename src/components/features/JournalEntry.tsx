
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { PenLine } from 'lucide-react';

interface JournalEntryProps {
  id: number;
  title: string;
  content: string;
  date: string;
  mood: string;
  onSave: (entry: { id: number; title: string; content: string; mood: string }) => void;
}

const JournalEntry = ({ id, title: initialTitle, content: initialContent, date, mood: initialMood, onSave }: JournalEntryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState(initialMood);

  const handleSave = () => {
    onSave({ id, title, content, mood });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title"
            className="font-medium text-lg"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            className="min-h-[200px]"
          />
          <Input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="How are you feeling?"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:border-teal/20 transition-colors cursor-pointer" onClick={() => setIsEditing(true)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
          <PenLine className="w-5 h-5 text-teal" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{title}</h3>
              <p className="text-sm text-gray-500">{date}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal/10 text-teal text-sm">
              {mood}
            </span>
          </div>
          <p className="mt-2 text-gray-600">{content}</p>
        </div>
      </div>
    </Card>
  );
};

export default JournalEntry;
