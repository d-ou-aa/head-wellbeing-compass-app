
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
      "You're doing your best even when it feels like the world is heavy. Feeling tired doesn't make you weak; it means you've been strong for too long, and now it's time to care for yourself gently.",
      "It's okay to feel exhausted — mentally, emotionally, or physically. Rest is not a luxury; it's your body and soul asking for healing. Take the time you need, and be proud of every small step forward.",
      "Acknowledging that you're feeling drained is not a sign of failure — it's a sign of awareness and courage. You are not alone, and with time, compassion, and support, you can feel light and whole again."
    ],
    symptoms: [
      "tired", "exhaustion", "lack of energy", "feeling drained", "fatigue", "exhausted", 
      "drained", "weary", "no strength", "sluggish", "no energy"
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
      "It's perfectly okay to feel sadness. These emotions are a part of being human. You don't need to hide how you feel — your emotions are valid, and expressing them is the first step toward healing.",
      "Crying and feeling down does not make you weak — it means you care deeply. There is light at the end of this, and with love and patience, your heart will smile again, even if it takes time.",
      "Losing interest in what you once loved doesn't mean you're broken. It means you're going through something deep. But please remember — your joy is still within you, waiting patiently to return when you're ready."
    ],
    symptoms: [
      "feeling sad", "feeling blue", "emotional pain", "hopelessness", "sad", "unhappy", 
      "depressed", "down", "gloomy", "grief", "misery", "heartache", "melancholy", "downhearted"
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
    ],
    symptoms: [
      "feeling anxious", "nervous energy", "can't relax", "feeling jittery", "restless",
      "agitation", "unease", "fidgeting", "nervousness", "disquiet", "on edge", "anxious"
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
    ],
    symptoms: [
      "sweaty palms", "excessive sweating", "feeling clammy", "nervous perspiration",
      "perspiration", "moisture", "clamminess", "dripping", "dampness"
    ]
  }
};

export const mentalHealthData = {
  Depression,
  Anxiety
};
