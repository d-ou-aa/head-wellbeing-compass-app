
import React, { useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Plus, FileText } from 'lucide-react';

const Journal = () => {
  const [entries] = useState([
    {
      id: 1,
      date: '2024-04-25',
      title: 'My first journal entry',
      mood: 'Calm',
      content: 'Today was a productive day...'
    }
  ]);

  return (
    <MainLayout pageTitle="Journal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-neutral-dark">My Journal</h2>
          <Button className="bg-teal hover:bg-teal/90">
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>

        <div className="grid gap-4">
          {entries.map(entry => (
            <Card key={entry.id} className="p-4 hover:border-teal/20 transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <PenLine className="w-5 h-5 text-teal" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{entry.title}</h3>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-teal/10 text-teal text-sm">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{entry.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Journal;
