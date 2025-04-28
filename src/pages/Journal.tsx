
import React, { useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import JournalEntry from '@/components/features/JournalEntry';
import NewJournalEntry from '@/components/features/NewJournalEntry';

const Journal = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2024-04-25',
      title: 'My first journal entry',
      mood: 'Calm',
      content: 'Today was a productive day...'
    }
  ]);

  const handleSaveNewEntry = (entry: { title: string; content: string; mood: string }) => {
    const newEntry = {
      id: entries.length + 1,
      date: new Date().toISOString().split('T')[0],
      ...entry
    };
    setEntries([newEntry, ...entries]);
    setShowNewEntry(false);
  };

  const handleUpdateEntry = (updatedEntry: { id: number; title: string; content: string; mood: string }) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? { ...entry, ...updatedEntry } : entry
    ));
  };

  return (
    <MainLayout pageTitle="Journal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-neutral-dark">My Journal</h2>
          <Button 
            className="bg-teal hover:bg-teal/90"
            onClick={() => setShowNewEntry(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>

        <div className="grid gap-4">
          {showNewEntry && (
            <NewJournalEntry onSave={handleSaveNewEntry} />
          )}
          
          {entries.map(entry => (
            <JournalEntry
              key={entry.id}
              {...entry}
              onSave={handleUpdateEntry}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Journal;
