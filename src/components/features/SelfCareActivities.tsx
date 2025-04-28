import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, Leaf, Brain } from 'lucide-react';
import { saveGratitudeEntry } from '@/services/gratitudeService';
import { useToast } from '@/hooks/use-toast';

const SelfCareActivities = () => {
  const [activeExercise, setActiveExercise] = useState<null | 'breathing' | 'gratitude' | 'grounding'>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>(['', '', '']);
  const [groundingSenses, setGroundingSenses] = useState({
    see: ['', '', '', '', ''],
    hear: ['', '', '', ''],
    touch: ['', '', ''],
    smell: ['', ''],
    taste: ['']
  });
  const { toast } = useToast();

  useEffect(() => {
    if (activeExercise === 'breathing') {
      const timer = setTimeout(() => {
        if (breathingPhase === 'inhale') {
          setBreathingPhase('hold');
        } else if (breathingPhase === 'hold') {
          setBreathingPhase('exhale');
        } else {
          setBreathingPhase('inhale');
          setBreathingCount(prev => prev > 1 ? prev - 1 : 4);
        }
      }, breathingPhase === 'hold' ? 1500 : 3000);
      
      return () => clearTimeout(timer);
    }
  }, [activeExercise, breathingPhase, breathingCount]);

  const handleGratitudeChange = (index: number, value: string) => {
    setGratitudeEntries(prev => {
      const newEntries = [...prev];
      newEntries[index] = value;
      return newEntries;
    });
  };

  const handleGratitudeComplete = () => {
    if (gratitudeEntries.some(entry => !entry.trim())) {
      toast({
        title: "Please fill all entries",
        description: "Share three things you're grateful for before completing.",
        variant: "destructive"
      });
      return;
    }

    saveGratitudeEntry(gratitudeEntries);
    toast({
      title: "Gratitude practice completed!",
      description: "Your grateful moments have been saved.",
    });
    setActiveExercise(null);
    setGratitudeEntries(['', '', '']);
  };

  const handleGroundingChange = (sense: keyof typeof groundingSenses, index: number, value: string) => {
    setGroundingSenses(prev => ({
      ...prev,
      [sense]: prev[sense].map((item, i) => i === index ? value : item)
    }));
  };

  const renderBreathingExercise = () => (
    <div className="flex flex-col items-center py-8">
      <div className="breathing-circle mb-4">
        <div className={`breathing-circle-inner ${
          breathingPhase === 'inhale' ? 'scale-100' : 
          breathingPhase === 'hold' ? 'scale-110' :
          'scale-75'
        } transition-transform duration-3000`}></div>
      </div>
      
      <h4 className="text-lg font-medium mb-2">
        {breathingPhase === 'inhale' ? 'Inhale...' : 
         breathingPhase === 'hold' ? 'Hold...' : 
         'Exhale...'}
      </h4>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {breathingCount} {breathingCount === 1 ? 'breath' : 'breaths'} remaining
      </p>
      
      <Button 
        onClick={() => setActiveExercise(null)}
        variant="outline"
        className="mt-6"
      >
        End Exercise
      </Button>
    </div>
  );

  const renderGratitudePractice = () => (
    <div className="space-y-6 py-8">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-teal mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Gratitude Practice</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Take a moment to reflect on three things you're grateful for today
        </p>
      </div>

      <div className="space-y-4">
        {gratitudeEntries.map((entry, index) => (
          <div key={index}>
            <label className="text-sm text-gray-600 mb-1 block">
              I am grateful for...
            </label>
            <Input
              value={entry}
              onChange={(e) => handleGratitudeChange(index, e.target.value)}
              placeholder={`Gratitude ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <Button 
        onClick={handleGratitudeComplete}
        variant="outline"
        className="w-full mt-6"
      >
        Complete Practice
      </Button>
    </div>
  );

  const renderGroundingExercise = () => (
    <div className="space-y-6 py-8">
      <div className="text-center mb-6">
        <Leaf className="w-12 h-12 text-teal mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">5-4-3-2-1 Grounding</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Use your senses to ground yourself in the present moment
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-4">
          <h4 className="font-medium mb-3">5 things you can see</h4>
          <div className="space-y-2">
            {groundingSenses.see.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleGroundingChange('see', index, e.target.value)}
                placeholder={`I can see...`}
              />
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3">4 things you can hear</h4>
          <div className="space-y-2">
            {groundingSenses.hear.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleGroundingChange('hear', index, e.target.value)}
                placeholder={`I can hear...`}
              />
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3">3 things you can touch</h4>
          <div className="space-y-2">
            {groundingSenses.touch.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleGroundingChange('touch', index, e.target.value)}
                placeholder={`I can touch...`}
              />
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3">2 things you can smell</h4>
          <div className="space-y-2">
            {groundingSenses.smell.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleGroundingChange('smell', index, e.target.value)}
                placeholder={`I can smell...`}
              />
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3">1 thing you can taste</h4>
          <div className="space-y-2">
            {groundingSenses.taste.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleGroundingChange('taste', index, e.target.value)}
                placeholder={`I can taste...`}
              />
            ))}
          </div>
        </Card>
      </div>

      <Button 
        onClick={() => setActiveExercise(null)}
        variant="outline"
        className="w-full mt-6"
      >
        Complete Exercise
      </Button>
    </div>
  );

  const renderExercisesList = () => {
    const exercises = [
      {
        id: 'breathing',
        title: 'Breathing Exercise',
        description: '4-7-8 breathing technique for stress relief',
        icon: <Brain className="w-5 h-5 text-teal" />
      },
      {
        id: 'gratitude',
        title: 'Gratitude Practice',
        description: 'List 3 things you are grateful for today',
        icon: <Heart className="w-5 h-5 text-teal" />
      },
      {
        id: 'grounding',
        title: '5-4-3-2-1 Grounding',
        description: 'Engage your senses to center yourself',
        icon: <Leaf className="w-5 h-5 text-teal" />
      }
    ];
    
    return (
      <>
        <h3 className="text-lg font-medium mb-4">Self-Care Activities</h3>
        <div className="space-y-3">
          {exercises.map(exercise => (
            <button 
              key={exercise.id}
              className="w-full p-4 bg-secondary dark:bg-gray-800 rounded-lg flex items-start text-left hover:bg-teal/10 transition-colors"
              onClick={() => setActiveExercise(exercise.id as any)}
            >
              <div className="mr-3">{exercise.icon}</div>
              <div>
                <h4 className="font-medium">{exercise.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.description}</p>
              </div>
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      {activeExercise === 'breathing' ? renderBreathingExercise() :
       activeExercise === 'gratitude' ? renderGratitudePractice() :
       activeExercise === 'grounding' ? renderGroundingExercise() :
       renderExercisesList()}
    </div>
  );
};

export default SelfCareActivities;
