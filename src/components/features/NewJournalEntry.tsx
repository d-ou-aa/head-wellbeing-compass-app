
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface NewJournalEntryProps {
  onSave: (entry: { title: string; content: string; mood: string }) => void;
}

const NewJournalEntry = ({ onSave }: NewJournalEntryProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const handleSave = () => {
    if (!title || !content || !mood) return;
    onSave({ title, content, mood });
    setTitle('');
    setContent('');
    setMood('');
  };

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
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Entry</Button>
        </div>
      </div>
    </Card>
  );
};

export default NewJournalEntry;
