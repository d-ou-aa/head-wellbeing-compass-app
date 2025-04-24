
import React, { useState, useEffect } from 'react';

const SelfCareActivities = () => {
  const [activeExercise, setActiveExercise] = useState<null | 'breathing' | 'gratitude' | 'grounding'>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  
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
  
  const renderBreathingExercise = () => {
    return (
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
        
        <button 
          onClick={() => setActiveExercise(null)}
          className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
        >
          End Exercise
        </button>
      </div>
    );
  };
  
  const renderExercisesList = () => {
    const exercises = [
      {
        id: 'breathing',
        title: 'Breathing Exercise',
        description: '4-7-8 breathing technique for stress relief',
        icon: '🫁'
      },
      {
        id: 'gratitude',
        title: 'Gratitude Practice',
        description: 'List 3 things you are grateful for today',
        icon: '🙏'
      },
      {
        id: 'grounding',
        title: '5-4-3-2-1 Grounding',
        description: 'Engage your senses to center yourself',
        icon: '🌱'
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
              <div className="mr-3 text-2xl">{exercise.icon}</div>
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
      {activeExercise === 'breathing' ? renderBreathingExercise() : renderExercisesList()}
    </div>
  );
};

export default SelfCareActivities;
