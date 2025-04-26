
import { Disorder } from '@/types/mentalHealth';

export const Depression: Disorder = {
  Fatigue: {
    questions: [
      "Do you often feel tired even after sleeping?",
      "Do you lack energy to complete daily tasks?",
      "Do you feel physically or mentally drained?",
      "Do you struggle to stay awake during the day?",
      "Do you feel exhausted without doing much?"
    ],
    affirmations: [
      "Fatigue is one of the most common signs of depression.",
      "You're not lazy; your mind and body are trying to cope.",
      "Many people with depression feel tired most of the time.",
      "Recognizing fatigue is the first step toward recovery."
    ]
  },
  Sadness: {
    questions: [
      "Have you been feeling unusually sad or down?",
      "Do you feel like crying often?",
      "Have you lost interest in things that once made you happy?",
      "Do you feel a deep sense of emptiness?",
      "Do you find it hard to feel joy lately?"
    ],
    affirmations: [
      "Persistent sadness can indicate depression.",
      "It's okay to feel down, and you're not alone.",
      "Acknowledging sadness is brave and important.",
      "Sadness isn't weakness—it's a signal you deserve care."
    ]
  }
};

export const Anxiety: Disorder = {
  Restlessness: {
    questions: [
      "Do you find it hard to relax even in calm situations?",
      "Do you feel like you're constantly on edge?",
      "Do you fidget or move around when anxious?",
      "Does your mind race uncontrollably?",
      "Do you feel jumpy or overly alert?"
    ],
    affirmations: [
      "Restlessness is a common symptom of anxiety.",
      "You're not alone—many people feel the same way.",
      "Being restless doesn't mean something is wrong with you.",
      "It's okay to need calm—it's a strength to seek peace."
    ]
  },
  Sweating: {
    questions: [
      "Do you sweat a lot when you're nervous or anxious?",
      "Do your palms get sweaty in stressful situations?",
      "Do you feel hot or clammy even when it's cool?",
      "Does your heart race and make you sweat?",
      "Does anxiety make your body react with sweat?"
    ],
    affirmations: [
      "Sweating is a physical sign of anxiety.",
      "Your body is reacting to perceived danger—this is normal.",
      "You're not alone in experiencing this.",
      "Understanding these symptoms helps reduce fear of them."
    ]
  }
};
