
import React, { useState } from 'react';

type Mood = 'great' | 'good' | 'okay' | 'sad' | 'awful';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moods: { type: Mood; emoji: string; label: string }[] = [
    { type: 'great', emoji: '😄', label: 'Great' },
    { type: 'good', emoji: '🙂', label: 'Good' },
    { type: 'okay', emoji: '😐', label: 'Okay' },
    { type: 'sad', emoji: '😔', label: 'Sad' },
    { type: 'awful', emoji: '😢', label: 'Awful' },
  ];

  const handleSubmit = () => {
    if (selectedMood) {
      console.log('Mood logged:', { mood: selectedMood, note });
      setSubmitted(true);
      
      // Reset after 3 seconds to allow another entry
      setTimeout(() => {
        setSelectedMood(null);
        setNote('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-5xl mb-4 animate-bounce">✅</div>
          <h3 className="text-xl font-medium mb-2">Mood Logged!</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Thank you for checking in. Taking note of your feelings is an important step for mental wellness.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-4">How are you feeling today?</h3>
          <div className="flex justify-between mb-6">
            {moods.map((mood) => (
              <button
                key={mood.type}
                className={`mood-button ${selectedMood === mood.type ? 'active' : ''}`}
                onClick={() => setSelectedMood(mood.type)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Would you like to add a note? (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
              rows={3}
              placeholder="What's on your mind today?"
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className={`w-full py-3 rounded-md text-white transition-colors ${
              selectedMood ? 'bg-teal hover:bg-teal-dark' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            Log Your Mood
          </button>
        </>
      )}
    </div>
  );
};

export default MoodTracker;
