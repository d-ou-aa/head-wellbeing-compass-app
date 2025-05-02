
import { mentalHealthData } from '@/data/mentalHealthData';

// Types for our knowledge graph
export type Disorder = {
  name: string;
  therapies: Therapy[];
  description?: string;
};

export type Therapy = {
  name: string;
  label: string;
  description?: string;
};

// Create our knowledge graph of mental health disorders and therapies
const disorderTherapyGraph: Record<string, Disorder> = {
  'Depression': {
    name: 'Depression',
    therapies: [
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' },
      { name: 'Medication', label: 'Medication' },
      { name: 'MindfulnessTherapy', label: 'Mindfulness-Based Therapy' }
    ],
    description: 'A mood disorder characterized by persistent feelings of sadness, hopelessness, and loss of interest in activities.'
  },
  'Anxiety Disorder': {
    name: 'Anxiety Disorder',
    therapies: [
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' },
      { name: 'ExposureTherapy', label: 'Exposure Therapy' }
    ],
    description: 'A group of mental health disorders characterized by significant feelings of anxiety and fear.'
  },
  'Bipolar Disorder': {
    name: 'Bipolar Disorder',
    therapies: [
      { name: 'Medication', label: 'Medication' },
      { name: 'Psychoeducation', label: 'Psychoeducation' }
    ],
    description: 'A mental health condition that causes extreme mood swings including emotional highs (mania) and lows (depression).'
  },
  'PTSD': {
    name: 'PTSD',
    therapies: [
      { name: 'EMDR', label: 'Eye Movement Desensitization and Reprocessing (EMDR)' },
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' }
    ],
    description: 'A mental health condition triggered by experiencing or witnessing a terrifying event.'
  },
  'OCD': {
    name: 'OCD',
    therapies: [
      { name: 'ExposureTherapy', label: 'Exposure Therapy' },
      { name: 'BehavioralTherapy', label: 'Behavioral Therapy' }
    ],
    description: 'A disorder characterized by unreasonable thoughts and fears that lead to repetitive behaviors.'
  },
  'Schizophrenia': {
    name: 'Schizophrenia',
    therapies: [
      { name: 'Medication', label: 'Medication' },
      { name: 'Psychoeducation', label: 'Psychoeducation' }
    ],
    description: 'A serious mental disorder in which people interpret reality abnormally.'
  },
  'ADHD': {
    name: 'ADHD',
    therapies: [
      { name: 'BehavioralTherapy', label: 'Behavioral Therapy' },
      { name: 'Medication', label: 'Medication' }
    ],
    description: 'A mental health disorder that includes a combination of persistent problems, such as difficulty paying attention, hyperactivity and impulsive behavior.'
  },
  'Autism Spectrum': {
    name: 'Autism Spectrum',
    therapies: [
      { name: 'BehavioralTherapy', label: 'Behavioral Therapy' },
      { name: 'FamilyTherapy', label: 'Family Therapy' }
    ],
    description: 'A developmental disorder that affects communication and behavior.'
  },
  'Borderline PD': {
    name: 'Borderline PD',
    therapies: [
      { name: 'DBT', label: 'Dialectical Behavioral Therapy' },
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' }
    ],
    description: 'A personality disorder characterized by unstable moods, behavior, and relationships.'
  },
  'Eating Disorder': {
    name: 'Eating Disorder',
    therapies: [
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' },
      { name: 'FamilyTherapy', label: 'Family Therapy' }
    ],
    description: 'Conditions related to persistent eating behaviors that negatively impact health, emotions, and ability to function.'
  },
  'Panic Disorder': {
    name: 'Panic Disorder',
    therapies: [
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' },
      { name: 'MindfulnessTherapy', label: 'Mindfulness-Based Therapy' }
    ],
    description: 'An anxiety disorder characterized by recurring unexpected panic attacks.'
  },
  'Social Anxiety Disorder': {
    name: 'Social Anxiety Disorder',
    therapies: [
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' },
      { name: 'ExposureTherapy', label: 'Exposure Therapy' }
    ],
    description: 'A chronic mental health condition where social interactions cause irrational anxiety.'
  },
  'Sleep Disorder': {
    name: 'Sleep Disorder',
    therapies: [
      { name: 'CBT', label: 'Cognitive Behavioral Therapy' },
      { name: 'Medication', label: 'Medication' }
    ],
    description: 'A group of conditions that affect the ability to sleep well on a regular basis.'
  }
};

// Functions to query our knowledge graph
export function getDisorderDetails(disorderName: string): Disorder | null {
  const normalizedName = disorderName.toLowerCase();
  
  // Find the disorder in our graph by case-insensitive name match
  const match = Object.keys(disorderTherapyGraph).find(
    key => key.toLowerCase() === normalizedName ||
           key.toLowerCase().includes(normalizedName)
  );
  
  return match ? disorderTherapyGraph[match] : null;
}

export function getRecommendedTherapies(disorderName: string): Therapy[] {
  const disorder = getDisorderDetails(disorderName);
  return disorder ? disorder.therapies : [];
}

export function getAllDisorders(): string[] {
  return Object.keys(disorderTherapyGraph);
}

export function getRecommendationsBySymptoms(symptoms: string[]): Record<string, Therapy[]> {
  const recommendations: Record<string, Therapy[]> = {};
  
  // Match symptoms to potential disorders
  Object.entries(mentalHealthData).forEach(([disorderName, disorder]) => {
    Object.keys(disorder).forEach(symptomName => {
      if (symptoms.some(s => s.toLowerCase() === symptomName.toLowerCase())) {
        const therapies = getRecommendedTherapies(disorderName);
        if (therapies.length > 0) {
          recommendations[disorderName] = therapies;
        }
      }
    });
  });
  
  return recommendations;
}

// Get a therapeutic response based on detected disorder
export function getTherapeuticResponse(disorderName: string): string {
  const disorder = getDisorderDetails(disorderName);
  if (!disorder) return '';
  
  const responses: Record<string, string[]> = {
    'Depression': [
      "I understand you're experiencing symptoms of depression. Would you like to know about therapies like Cognitive Behavioral Therapy that can help?",
      "Depression can make everything feel overwhelming. Have you considered talking to someone about Mindfulness-Based Therapy?",
      "Living with depression can be difficult. Many people find that a combination of medication and therapy provides relief. Would you like to know more?"
    ],
    'Anxiety Disorder': [
      "I notice you're describing anxiety symptoms. Exposure therapy has been shown to be effective for many people. Would that be something you'd like to learn about?",
      "Anxiety can feel overwhelming at times. CBT techniques can provide practical tools to manage these feelings. Would you like to know more about that approach?",
      "Living with anxiety can be challenging. Have you tried any relaxation techniques or mindfulness practices?"
    ],
    'Bipolar Disorder': [
      "Managing the ups and downs of bipolar disorder often involves a combination of medication and therapy. Have you worked with a psychiatrist on finding the right treatment plan?",
      "Understanding bipolar disorder through psychoeducation can be empowering. Would you like to learn more about this approach?",
      "Living with bipolar disorder can be challenging. How are you managing your self-care during different mood states?"
    ],
    'PTSD': [
      "Processing traumatic experiences can be difficult. EMDR therapy has helped many people with PTSD. Would you like to know more about this approach?",
      "Trauma can affect us in many ways. Have you worked with a therapist who specializes in trauma-informed care?",
      "Living with PTSD can be challenging. How are you taking care of yourself when difficult memories arise?"
    ]
  };

  // Get responses for this disorder or use generic responses
  const disorderResponses = responses[disorderName] || [
    `I understand you're experiencing symptoms related to ${disorderName}. Have you spoken with a mental health professional about treatment options?`,
    `Living with ${disorderName} can present unique challenges. What strategies have you found helpful so far?`,
    `There are several evidence-based approaches for managing ${disorderName}. Would you like to know about some therapy options that might help?`
  ];
  
  // Return a random response from the available options
  return disorderResponses[Math.floor(Math.random() * disorderResponses.length)];
}

// Function to provide a flexible therapeutic response
export function generateTherapeuticResponse(
  detectedSymptoms: string[],
  confirmedDisorders: string[],
  conversationContext: 'initial' | 'exploring' | 'recommending' | 'supporting'
): string {
  // If we have confirmed disorders, prioritize those for responses
  if (confirmedDisorders.length > 0) {
    const disorder = confirmedDisorders[Math.floor(Math.random() * confirmedDisorders.length)];
    return getTherapeuticResponse(disorder);
  }
  
  // If we have detected symptoms but no confirmed disorders yet
  if (detectedSymptoms.length > 0) {
    // Match symptoms to potential disorders
    const possibleDisorders: string[] = [];
    
    Object.entries(mentalHealthData).forEach(([disorderName, disorder]) => {
      Object.keys(disorder).forEach(symptomName => {
        if (detectedSymptoms.some(s => s === symptomName) && !possibleDisorders.includes(disorderName)) {
          possibleDisorders.push(disorderName);
        }
      });
    });
    
    if (possibleDisorders.length > 0) {
      const disorder = possibleDisorders[Math.floor(Math.random() * possibleDisorders.length)];
      return getTherapeuticResponse(disorder);
    }
  }
  
  // Default responses based on conversation context
  const contextResponses: Record<string, string[]> = {
    'initial': [
      "I'm here to listen. How have you been feeling lately?",
      "Thank you for reaching out. Would you like to share what's been on your mind?",
      "I'm here to support you. What would be most helpful to talk about today?"
    ],
    'exploring': [
      "Could you tell me more about how these feelings have been affecting your daily life?",
      "How long have you been experiencing these symptoms?",
      "On a scale of 1-10, how would you rate the impact these feelings have on your life right now?"
    ],
    'recommending': [
      "Based on what you've shared, there are some approaches that might be helpful. Would you like to hear about them?",
      "Many people with similar experiences have found relief through certain therapies. Would you like to know more?",
      "There are evidence-based treatments that can help with these symptoms. Would you like me to share some information?"
    ],
    'supporting': [
      "It sounds like you're going through a difficult time. Remember that seeking help is a sign of strength, not weakness.",
      "Thank you for sharing your experiences. What kind of support would be most helpful for you right now?",
      "I hear that this has been challenging for you. What small step might help you feel a bit better today?"
    ]
  };
  
  const responses = contextResponses[conversationContext] || contextResponses['initial'];
  return responses[Math.floor(Math.random() * responses.length)];
}
