import nltk
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('vader_lexicon', quiet=True) 

# Add these imports at the top of nlp.py
import random
import spacy
import emoji
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from autocorrect import Speller
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
from rdflib import Graph, Namespace, Literal, RDF, RDFS
import numpy as np
import random
import json
from googletrans import Translator

# Initialize language support
translator = Translator()

# Severity levels and their descriptions
severity_levels = {
    'mild': {
        'range': (0.0, 0.3),
        'description': {
            'en': 'Mild - Symptoms are present but manageable',
            'ar': 'خفيف - الأعراض موجودة ولكن يمكن التحكم بها',
            'fr': 'Léger - Les symptômes sont présents mais gérables'
        }
    },
    'moderate': {
        'range': (0.3, 0.6),
        'description': {
            'en': 'Moderate - Symptoms significantly affect daily life',
            'ar': 'متوسط - الأعراض تؤثر بشكل كبير على الحياة اليومية',
            'fr': 'Modéré - Les symptômes affectent significativement la vie quotidienne'
        }
    },
    'severe': {
        'range': (0.6, 1.0),
        'description': {
            'en': 'Severe - Symptoms are intense and greatly impact daily functioning',
            'ar': 'شديد - الأعراض شديدة وتؤثر بشكل كبير على الأداء اليومي',
            'fr': 'Sévère - Les symptômes sont intenses et impactent fortement le fonctionnement quotidien'
        }
    }
}

def translate_text(text, target_lang='en'):
    """Translate text to target language."""
    try:
        if target_lang == 'en':
            return text
        translation = translator.translate(text, dest=target_lang)
        return translation.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def assess_severity(symptom_data):
    """Assess the severity of symptoms based on confidence scores and sentiment."""
    # Factors to consider for severity
    confidence_weight = 0.4
    sentiment_weight = 0.3
    intensity_weight = 0.3
    
    # Calculate weighted severity score
    severity_score = (
        confidence_weight * symptom_data['confidence'] +
        sentiment_weight * (1 - symptom_data['sentiment']['scores']['compound']) +
        intensity_weight * symptom_data['sentiment']['intensity']
    )
    
    # Determine severity level
    for level, info in severity_levels.items():
        if info['range'][0] <= severity_score <= info['range'][1]:
            return {
                'level': level,
                'score': severity_score,
                'description': info['description']
            }
    
    return {
        'level': 'moderate',
        'score': severity_score,
        'description': severity_levels['moderate']['description']
    }

def get_language_specific_response(responses, lang='en'):
    """Get response in specified language."""
    if lang == 'en':
        return responses['en']
    
    try:
        if lang not in responses:
            translated = translate_text(responses['en'], lang)
            responses[lang] = translated
        return responses[lang]
    except Exception:
        return responses['en']

# Initialize sentiment analyzer and sentence transformer
sia = SentimentIntensityAnalyzer()
sentence_model = SentenceTransformer('all-MiniLM-L6-v2')

def analyze_sentiment(text):
    """Analyze the sentiment and emotional intensity of text."""
    if not text or not isinstance(text, str):
        raise ValueError("Input text must be a non-empty string")
    sentiment_scores = sia.polarity_scores(text)
    
    # Determine overall sentiment
    compound = sentiment_scores['compound']
    if compound >= 0.05:
        sentiment = 'positive'
    elif compound <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    # Calculate emotional intensity (0-1 scale)
    intensity = abs(compound)
    
    return {
        'sentiment': sentiment,
        'intensity': intensity,
        'scores': sentiment_scores
    }

def calculate_confidence_score(user_text, symptom_expression):
    """Calculate confidence score for symptom match using multiple metrics."""
    if not user_text or not symptom_expression:
        raise ValueError("Both user_text and symptom_expression must be non-empty strings")
    # Get embeddings  
    user_embedding = sentence_model.encode([user_text])
    symptom_embedding = sentence_model.encode([symptom_expression])  
    
    # Calculate semantic similarity (0-1)
    semantic_similarity = cosine_similarity(user_embedding, symptom_embedding)[0][0]
    
    # Calculate fuzzy string matching score (0-100)
    fuzzy_ratio = process.ratio(user_text.lower(), symptom_expression.lower()) / 100
    
    # Get sentiment intensity
    sentiment_intensity = analyze_sentiment(user_text)['intensity']
    
    # Combine scores with weights
    weights = {'semantic': 0.5, 'fuzzy': 0.3, 'sentiment': 0.2}
    confidence_score = (
        weights['semantic'] * semantic_similarity +
        weights['fuzzy'] * fuzzy_ratio +
        weights['sentiment'] * sentiment_intensity
    )
    
    return {
        'overall_confidence': confidence_score,
        'semantic_similarity': semantic_similarity,
        'fuzzy_match': fuzzy_ratio,
        'sentiment_intensity': sentiment_intensity
    }
# Load SpaCy
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# Define RDF Namespace and graph
g = Graph()
ex = Namespace("http://example.org/mentalhealth#")

# Define Base Classes
g.add((ex.MentalHealthIssue, RDF.type, RDFS.Class))
g.add((ex.Therapy, RDF.type, RDFS.Class))

# Define Mental Health Disorders
disorder_classes = [
    'Depression', 'Psychosis', 'AnxietyDisorder', 'BipolarDisorder', 'PTSD',
    'OCD', 'Schizophrenia', 'ADHD', 'AutismSpectrum', 'BorderlinePD',
    'NarcissisticPD', 'EatingDisorder', 'SubstanceUseDisorder', 'Dysthymia',
    'PanicDisorder', 'SocialAnxietyDisorder', 'Hypochondriasis', 'ParanoidPD',
    'HistrionicPD', 'AntisocialPD', 'SchizoidPD', 'SchizotypalPD', 'DependentPD',
    'AvoidantPD', 'Cyclothymia', 'SomaticSymptomDisorder', 'ConversionDisorder',
    'BodyDysmorphicDisorder', 'IntermittentExplosiveDisorder', 'OppositionalDefiantDisorder',
    'ConductDisorder', 'SleepDisorder'
]

for disorder in disorder_classes:
    g.add((ex[disorder], RDF.type, RDFS.Class))

# Define Therapy Classes and Labels
therapy_labels = {
    'CBT': 'Cognitive Behavioral Therapy',
    'DBT': 'Dialectical Behavioral Therapy',
    'Medication': 'Medication',
    'Psychoeducation': 'Psychoeducation',
    'ExposureTherapy': 'Exposure Therapy',
    'BehavioralTherapy': 'Behavioral Therapy',
    'FamilyTherapy': 'Family Therapy',
    'MindfulnessTherapy': 'Mindfulness-Based Therapy',
    'EMDR': 'Eye Movement Desensitization and Reprocessing (EMDR)'
}

for therapy, label in therapy_labels.items():
    g.add((ex[therapy], RDF.type, ex.Therapy))
    g.add((ex[therapy], RDFS.label, Literal(label)))

# Define therapy relationships
therapy_relationships = {
    'Depression': ['CBT', 'Medication', 'MindfulnessTherapy'],
    'AnxietyDisorder': ['CBT', 'ExposureTherapy'],
    'BipolarDisorder': ['Medication', 'Psychoeducation'],
    'PTSD': ['EMDR', 'CBT'],
    'OCD': ['ExposureTherapy', 'BehavioralTherapy'],
    'Schizophrenia': ['Medication', 'Psychoeducation'],
    'ADHD': ['BehavioralTherapy', 'Medication'],
    'AutismSpectrum': ['BehavioralTherapy', 'FamilyTherapy'],
    'BorderlinePD': ['DBT', 'CBT'],
    'NarcissisticPD': ['CBT', 'Psychoeducation'],
    'EatingDisorder': ['CBT', 'FamilyTherapy'],
    'SubstanceUseDisorder': ['Medication', 'CBT'],
    'PanicDisorder': ['CBT', 'MindfulnessTherapy'],
    'SocialAnxietyDisorder': ['CBT', 'ExposureTherapy'],
    'ParanoidPD': ['CBT', 'Psychoeducation'],
    'HistrionicPD': ['CBT', 'DBT'],
    'AntisocialPD': ['BehavioralTherapy', 'Psychoeducation'],
    'SchizoidPD': ['CBT', 'Psychoeducation'],
    'SchizotypalPD': ['CBT', 'Psychoeducation'],
    'DependentPD': ['CBT', 'BehavioralTherapy'],
    'AvoidantPD': ['CBT', 'ExposureTherapy'],
    'Cyclothymia': ['CBT', 'Medication'],
    'SomaticSymptomDisorder': ['CBT', 'Psychoeducation'],
    'ConversionDisorder': ['CBT', 'BehavioralTherapy'],
    'BodyDysmorphicDisorder': ['CBT', 'Medication'],
    'IntermittentExplosiveDisorder': ['BehavioralTherapy', 'Medication'],
    'OppositionalDefiantDisorder': ['FamilyTherapy', 'BehavioralTherapy'],
    'ConductDisorder': ['BehavioralTherapy', 'FamilyTherapy'],
    'SleepDisorder': ['CBT', 'Medication']
}

# Add therapy relationships to graph
for disorder, therapies in therapy_relationships.items():
    for therapy in therapies:
        g.add((ex[disorder], ex.hasTherapy, ex[therapy]))

# Define disorders and their symptoms
disorders = {
    "depression": ["sadness", "fatigue", "loss_of_interest", "sleep_disturbance", "hopelessness", "changes_in_appetite"],
    "psychosis": ["hallucinations", "delusions", "disorganized_thinking", "abnormal_motor_behavior", "social_withdrawal"],
    "anxiety_disorder": ["excessive_worry", "restlessness", "panic_attacks", "rapid_heartbeat", "shortness_of_breath", "sweating"],
    "ptsd": ["flashbacks", "nightmares", "severe_anxiety", "hypervigilance", "avoidance_behaviors", "emotional_numbing"],
    "ocd": ["obsessive_thoughts", "compulsive_behavior", "anxiety", "fear_of_contamination", "need_for_order", "perfectionism"],
    "autism_spectrum": ["social_communication_difficulties", "repetitive_behaviors", "sensory_sensitivities", "routine_dependence"],
    "borderline_pd": ["emotional_instability", "fear_of_abandonment", "identity_disturbance", "impulsivity", "self_harm"],
    "narcissistic_pd": ["grandiosity", "need_for_admiration", "lack_of_empathy", "sense_of_entitlement"],
    "substance_use_disorder": ["craving", "loss_of_control", "social_problems", "risky_use", "tolerance"],
    "panic_disorder": ["panic_attacks", "fear_of_future_attacks", "avoidance_behavior", "physical_symptoms"],
    "social_anxiety_disorder": ["social_fear", "avoidance_of_social_situations", "physical_symptoms_in_social_settings"],
    "paranoid_pd": ["distrust", "suspiciousness", "reluctance_to_confide", "holding_grudges"],
    "schizoid_pd": ["emotional_coldness", "social_detachment", "limited_expression", "preference_for_solitude"],
    "dependent_pd": ["excessive_need_for_care", "submissive_behavior", "fear_of_separation", "lack_of_self_confidence"],
    "avoidant_pd": ["social_inhibition", "feelings_of_inadequacy", "hypersensitivity_to_criticism", "avoidance_of_activities"],
    "somatic_symptom_disorder": ["excessive_health_concerns", "multiple_physical_complaints", "anxiety_about_health"],
    "body_dysmorphic_disorder": ["preoccupation_with_appearance", "repetitive_behaviors", "social_avoidance", "distress"],
    "intermittent_explosive_disorder": ["aggressive_outbursts", "disproportionate_reactions", "impulsivity", "irritability"],
    "oppositional_defiant_disorder": ["defiant_behavior", "argumentative", "vindictiveness", "anger"],
    "conduct_disorder": ["aggression_to_people_animals", "property_destruction", "deceitfulness", "rule_violation"],
    "sleep_disorder": ["insomnia", "excessive_daytime_sleepiness", "irregular_sleep_patterns", "sleep_disturbances"],
    "bipolar_disorder": ["mood_swings", "manic_episodes", "depressive_episodes", "impulsivity", "irritability"],
    "schizophrenia": ["hallucinations", "delusions", "disorganized_speech", "cognitive_impairment", "social_withdrawal"],
    "adhd": ["inattention", "hyperactivity", "impulsivity", "difficulty_focusing", "forgetfulness"],
    "eating_disorder": ["extreme_dieting", "binge_eating", "fear_of_weight_gain", "distorted_body_image"]
}

treatments = {
    "depression": ["cbt", "medication", "mindfulness_therapy"],
    "psychosis": ["medication", "cbt", "family_therapy"],
    "anxiety_disorder": ["cbt", "exposure_therapy", "mindfulness_therapy"],
    "ptsd": ["emdr", "cbt", "exposure_therapy"],
    "ocd": ["exposure_therapy", "behavioral_therapy", "medication"],
    "autism_spectrum": ["behavioral_therapy", "family_therapy", "psychoeducation"],
    "borderline_pd": ["dbt", "cbt", "mindfulness_therapy"],
    "narcissistic_pd": ["cbt", "psychoeducation"],
    "substance_use_disorder": ["cbt", "behavioral_therapy", "medication"],
    "panic_disorder": ["cbt", "mindfulness_therapy", "medication"],
    "social_anxiety_disorder": ["cbt", "exposure_therapy", "mindfulness_therapy"],
    "paranoid_pd": ["cbt", "psychoeducation"],
    "schizoid_pd": ["cbt", "psychoeducation"],
    "dependent_pd": ["cbt", "behavioral_therapy"],
    "avoidant_pd": ["cbt", "exposure_therapy"],
    "somatic_symptom_disorder": ["cbt", "psychoeducation"],
    "body_dysmorphic_disorder": ["cbt", "exposure_therapy", "medication"],
    "intermittent_explosive_disorder": ["behavioral_therapy", "medication"],
    "oppositional_defiant_disorder": ["family_therapy", "behavioral_therapy"],
    "conduct_disorder": ["behavioral_therapy", "family_therapy"],
    "sleep_disorder": ["cbt", "medication", "behavioral_therapy"],
    "anxiety_disorder": ["cbt", "relaxation_techniques", "anxiolytic_medications", "breathing_exercises"],
    "bipolar_disorder": ["mood_stabilizers", "psychotherapy", "antipsychotic_medications"],
    "schizophrenia": ["antipsychotic_medications", "social_therapy", "cognitive_rehabilitation"],
    "ptsd": ["trauma_focused_therapy", "emdr_therapy", "exposure_therapy"],
    "ocd": ["exposure_and_response_prevention", "ssris", "mindfulness_therapy"],
    "adhd": ["behavioral_therapy", "stimulant_medications", "time_management_strategies"],
    "eating_disorder": ["nutritional_counseling", "cbt", "medical_supervision"],
    "borderline_personality_disorder": ["dialectical_behavior_therapy", "medication_for_mood_regulation", "self_help_strategies"],
    "insomnia": ["cognitive_behavioral_therapy_for_insomnia", "sleep_hygiene_improvements", "melatonin_supplements"]
}
# Add Disorders and their Symptoms
for disorder, symptoms in disorders.items():
    g.add((ex[disorder], RDF.type, ex.MentalHealthDisorder))
    for symptom in symptoms:
        g.add((ex[symptom], RDF.type, ex.Symptom))
        g.add((ex[disorder], ex.hasSymptom, ex[symptom]))

# Add Treatments
for disorder, treat_list in treatments.items():
    for treatment in treat_list:
        g.add((ex[treatment], RDF.type, ex.Treatment))
        g.add((ex[disorder], ex.hasTreatment, ex[treatment]))

# Add temporal relationships to track symptom progression
g.add((ex.Symptom, ex.hasTemporalRelation, ex.Duration))
g.add((ex.Symptom, ex.hasIntensity, ex.Severity))

# Add treatment success relationships
g.add((ex.Treatment, ex.hasSuccessRate, ex.SuccessMetric))
g.add((ex.Treatment, ex.hasSideEffect, ex.SideEffect))

symptom_expressions = {
    # Depression Symptoms
    "Sadness": [
        "I feel down", "I'm depressed", "I'm feeling blue", "I feel hopeless",
        "I'm in a bad mood", "I feel empty", "I'm crying a lot", "I have no joy",
        "I feel miserable", "Everything feels pointless", "I feel like giving up",
        "I feel lost", "I'm emotionally drained"
    ],
    "Fatigue": [
        "I'm so tired", "I have no energy", "I'm exhausted", "I feel drained",
        "I'm always sleepy", "I feel weak", "I can barely stay awake", "I'm running on empty",
        "I feel sluggish", "I have no strength", "Even moving feels hard"
    ],
    "Loss of Interest": [
        "I don’t enjoy anything", "I lost motivation", "Nothing excites me anymore",
        "I don't care about anything", "Everything feels boring", "I feel detached from life",
        "I used to love doing things, now I don’t", "I feel numb", "I feel disconnected",
        "I have no passion for anything"
    ],
    "Sleep Disturbance": [
        "I can't sleep", "I'm always waking up", "My sleep is bad", "I have trouble sleeping",
        "I have insomnia", "I keep tossing and turning", "I wake up tired", "I can't fall asleep",
        "My sleep is broken", "I'm up all night", "I wake up too early", "I barely get any rest"
    ],
    "Hopelessness": [
        "I feel like giving up", "Nothing will ever get better", "I have no hope",
        "I feel worthless", "I feel like there's no future", "Everything is meaningless",
        "I feel stuck", "There's no way out", "I feel like I'm drowning in my thoughts"
    ],
    "Changes in Appetite": [
        "I eat too much", "I have no appetite", "I forget to eat",
        "I don't feel hungry", "I binge eat", "I eat when I'm stressed",
        "I lost my hunger", "Food doesn't interest me anymore"
    ],

    # Anxiety Symptoms
    "Excessive Worry": [
        "I'm constantly anxious", "I overthink everything", "I can't stop worrying",
        "My mind won't stop", "I'm worried all the time", "I panic over small things",
        "I feel on edge", "I'm afraid something bad will happen", "I feel uneasy"
    ],
    "Restlessness": [
        "I can't sit still", "I feel uneasy", "I keep moving around", "I'm too jittery",
        "I feel antsy", "I can't relax", "I feel like I need to keep doing something",
        "I'm always fidgeting", "I can't stay calm", "I feel nervous energy"
    ],
    "Panic Attacks": [
        "I feel like I'm dying", "I can't breathe", "I have sudden fear",
        "My body is shaking", "I feel like I'm losing control", "My heart is pounding",
        "I feel dizzy and scared", "I feel like I'm choking", "I have a sudden rush of fear"
    ],
    "Rapid Heartbeat": [
        "My heart is racing", "I feel palpitations", "My chest is pounding", "I have heart flutters",
        "My heart is beating too fast", "I can hear my heart beating", "I feel a rush in my chest",
        "I feel like my heart will explode", "My heartbeat is irregular"
    ],
    "Shortness of Breath": [
        "I can't catch my breath", "I feel like I'm suffocating", "I struggle to breathe",
        "I gasp for air", "My chest feels tight", "I feel out of breath"
    ],
    "Sweating": [
        "I sweat too much", "I'm always drenched", "I feel hot and sweaty",
        "I start sweating even when I'm not hot", "My palms are always wet"
    ],

    # Bipolar Disorder Symptoms
    "Mood Swings": [
        "My emotions change so fast", "I go from happy to sad quickly", "I feel unpredictable",
        "I can't control my feelings", "I have extreme mood changes"
    ],
    "Manic Episodes": [
        "I have so much energy", "I feel unstoppable", "I can't slow down",
        "I feel like I can do anything", "I talk really fast", "I take big risks"
    ],
    "Depressive Episodes": [
        "I feel extremely low", "I don't want to do anything", "I feel like disappearing",
        "Nothing makes me happy anymore", "I can't get out of bed"
    ],
    "Impulsivity": [
        "I act without thinking", "I make quick decisions I regret", "I spend too much money",
        "I take big risks", "I say things without thinking"
    ],
    "Irritability": [
        "I get angry easily", "I feel annoyed all the time", "I'm super impatient",
        "Everything gets on my nerves", "I snap at people", "I feel tense and frustrated",
        "I can't control my temper", "I feel on edge", "I have a short fuse"
    ],

    # Schizophrenia Symptoms
    "Hallucinations": [
        "I see things that aren’t there", "I hear voices", "Things don’t seem real",
        "I feel disconnected from reality", "I see shadows moving", "I hear whispers",
        "I feel like someone is watching me", "I see colors and lights that aren’t there"
    ],
    "Delusions": [
        "People are watching me", "I think someone is after me", "I believe strange things",
        "I have weird thoughts", "I think people are talking about me", "I feel like I'm being followed",
        "I think I have special powers", "I feel like I know things no one else does"
    ],
    "Disorganized Speech": [
        "I talk in circles", "My words don’t make sense", "People don’t understand me",
        "I struggle to explain things", "I jump from one topic to another"
    ],
    "Cognitive Impairment": [
        "I can't focus", "I forget things easily", "My brain feels foggy",
        "I struggle to understand things", "I get confused a lot"
    ],
    "Social Withdrawal": [
        "I avoid people", "I don't want to see anyone", "I isolate myself",
        "I prefer being alone", "I don't like talking to people"
    ],

    # Insomnia Symptoms
    "Difficulty Falling Asleep": [
        "I can't fall a sleep", "It takes me forever to sleep", "I stay awake in bed",
        "I just can't shut my brain off at night", "I stare at the ceiling for hours"
    ],
    "Frequent Night Wakings": [
        "I wake up all the time", "I can't sleep through the night", "I keep waking up for no reason",
        "I wake up and can't go back to sleep"
    ],
    "Daytime Fatigue": [
        "I'm always tired during the day", "I feel like I haven't slept at all",
        "I need naps all the time", "I can't stay awake"
    ],
    "Irritability": [
        "I'm super moody when I don’t sleep", "I get angry easily", "I feel annoyed all the time",
        "I snap at people when I’m tired"
    ]
}
# 🔹 Smart Sentence Splitting (Handles Input Without Punctuation)
def smart_split(user_input):
    """Splits user input into meaningful parts without punctuation."""
    doc = nlp(user_input)  # Assuming nlp is already initialized (e.g., spaCy or similar NLP tool)
    phrases = []
    current_phrase = []

    for token in doc:
        current_phrase.append(token.text)
        # Common conjunctions and punctuation marks to split the sentence
        if token.text.lower() in ["and", "but", "also", "then", "so", "because", "or", "even", ",", "?", "!", "."]:
            phrases.append(" ".join(current_phrase).strip())
            current_phrase = []

    if current_phrase:
        phrases.append(" ".join(current_phrase).strip())

    return phrases
# 🔹 Preprocessing Function
def preprocess_text(user_input):
    """Cleans user input before extracting symptoms."""
    user_input = emoji.demojize(user_input)  # Convert emojis to text (e.g., ":smile:" for 😀)
    user_input = user_input.lower()  # Convert to lowercase
    user_input = user_input.translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    tokens = word_tokenize(user_input)  # Tokenize text into individual words
    stop_words = set(stopwords.words("english")) - set(["and", "but", "also", "then", "so", "because", "or", "even", ",", "?", "!", "."])# List of stopwords (e.g., "and", "the", etc.)
    tokens = [word for word in tokens if word not in stop_words]  # Remove stopwords
    spell = Speller(lang='en')  # Initialize spell checker 
    tokens = [spell(word) for word in tokens]  # Correct spelling of tokens
    return " ".join(tokens)  # Return cleaned and tokenized text as a single string
# Function to get symptom synonyms
def get_symptom_variants(symptom):
    """Generates synonyms for a symptom using WordNet and custom mappings."""
    synonyms = {symptom.lower()}  # Start with the symptom itself

    for syn in wordnet.synsets(symptom):  # Look for synonyms in WordNet
        for lemma in syn.lemmas():
            synonyms.add(lemma.name().replace("_", " ").lower())  # Add the synonyms to the set

    # Add custom synonyms for specific symptomsu78i
    if symptom.lower() == "fatigue":
        synonyms.update(["exhausted", "tired", "drained", "weary","sorrow", "grief", "misery", "heartache", "blue", "melancholy", "downhearted"])
    elif symptom.lower() == "panic attacks":
        synonyms.update(["anxiety attacks", "nervous breakdown", "freak-out"])
    elif symptom.lower() == "sadness":
        synonyms.update(["sorrow", "grief", "misery", "heartache","sad","blue", "melancholy", "downhearted","unhappy","depressed", "down", "gloomy"])
    elif symptom.lower() == "loss of interest":
        synonyms.update(["apathy", "indifference", "disinterest", "unconcern", "boredom"])
    elif symptom.lower() == "sleep disturbance":
        synonyms.update(["insomnia", "restlessness", "sleeplessness", "nocturnal", "disruption"])
    elif symptom.lower() == "hopelessness":
        synonyms.update(["despair", "pessimism", "dejection", "discouragement", "misery"])
    elif symptom.lower() == "changes in appetite":
        synonyms.update(["anorexia", "overeating", "under-eating", "cravings", "loss of appetite"])
    elif symptom.lower() == "excessive worry":
        synonyms.update(["anxiety", "concern", "apprehension", "unease", "fear"])
    elif symptom.lower() == "restlessness":
        synonyms.update(["agitation", "unease", "fidgeting", "nervousness", "disquiet"])
    elif symptom.lower() == "panic attacks":
        synonyms.update(["terror", "dread", "alarm", "fright", "fear", "apprehension", "shock"])
    elif symptom.lower() == "rapid heartbeat":
        synonyms.update(["palpitations", "tachycardia", "pulsing", "throbbing", "fluttering"])
    elif symptom.lower() == "shortness of breath":
        synonyms.update(["dyspnea", "breathlessness", "suffocation", "gasping", "wheezing", "hyperventilation"])
    elif symptom.lower() == "sweating":
        synonyms.update(["perspiration", "moisture", "clamminess", "dripping", "dampness"])
    elif symptom.lower() == "mood swings":
        synonyms.update(["fluctuations", "shifts", "instability", "variability", "changes", "oscillations"])
    elif symptom.lower() == "manic episodes":
        synonyms.update(["euphoria", "hyperactivity", "elation", "excitement", "frenzy", "freneticism"])
    elif symptom.lower() == "depressive episodes":
        synonyms.update(["doldrums", "low", "despondency", "melancholy", "blue", "gloom", "dejection"])
    elif symptom.lower() == "impulsivity":
        synonyms.update(["rashness", "recklessness", "haste", "spontaneity", "impetuosity"])
    elif symptom.lower() == "irritability":
        synonyms.update(["agitation", "annoyance", "frustration", "vexation", "exasperation"])
    elif symptom.lower() == "hallucinations":
        synonyms.update(["illusions", "delusions", "visions", "misperceptions", "fancies"])
    elif symptom.lower() == "delusions":
        synonyms.update(["misbelief", "falsehood", "fantasy", "illusion", "misconception", "hallucination"])
    elif symptom.lower() == "disorganized speech":
        synonyms.update(["incoherence", "babbling", "confusion", "jargon", "gibberish", "muddling"])
    elif symptom.lower() == "cognitive impairment":
        synonyms.update(["dysfunction", "deficit", "loss", "deterioration", "confusion"])
    elif symptom.lower() == "social withdrawal":
        synonyms.update(["isolation", "seclusion", "aloneness", "reticence", "solitude", "loneliness"])
    elif symptom.lower() == "flashbacks":
        synonyms.update(["recollections", "memories", "reminders", "replays", "reveries", "visions"])
    elif symptom.lower() == "nightmares":
        synonyms.update(["bad dreams", "phantasms"])

    elif symptom.lower() == "severe anxiety":
        synonyms.update(["terror", "panic", "fear", "dread", "alarm", "apprehension"])
    elif symptom.lower() == "hypervigilance":
        synonyms.update(["alertness", "watchfulness", "surveillance", "attention", "caution", "guardedness"])
    elif symptom.lower() == "avoidance behaviors":
        synonyms.update(["evasion", "withdrawal", "disengagement", "isolation"])
    elif symptom.lower() == "obsessive thoughts":
        synonyms.update(["preoccupations", "intrusions", "worries", "ruminations", "fixations"])
    elif symptom.lower() == "compulsive behavior":
        synonyms.update(["rituals", "obsessions", "acts", "habits", "addictions"])
    elif symptom.lower() == "anxiety":
        synonyms.update(["nervousness", "apprehension", "tension", "worry", "unease", "stress"])
    elif symptom.lower() == "fear of contamination":
        synonyms.update(["miasmophobia", "dirtiness", "germophobia", "cleanliness obsession"])
    elif symptom.lower() == "need for order":
        synonyms.update(["tidiness", "neatness", "organization", "systematization", "precision"])
    elif symptom.lower() == "inattention":
        synonyms.update(["neglect", "carelessness", "distraction", "absence", "unfocus", "lapse"])
    elif symptom.lower() == "hyperactivity":
        synonyms.update(["restlessness", "agitation", "fidgeting", "excitable", "overactivity"])
    elif symptom.lower() == "impulsivity":
        synonyms.update(["impetuosity", "rashness", "spontaneity", "instinctiveness", "haste"])
    elif symptom.lower() == "difficulty focusing":
        synonyms.update(["distractibility", "absence", "unfocused", "neglect", "inattention"])
    elif symptom.lower() == "forgetfulness":
        synonyms.update(["absent-mindedness", "memory loss", "negligence", "obliviousness"])
    elif symptom.lower() == "extreme dieting":
        synonyms.update(["starvation", "restriction", "fasting", "undereating", "self-control"])
    elif symptom.lower() == "binge eating":
        synonyms.update(["overindulgence", "gluttony", "excess", "gorging", "overconsumption"])
    elif symptom.lower() == "fear of weight gain":
        synonyms.update(["obesophobia", "fat phobia", "weight anxiety", "thin obsession"])
    elif symptom.lower() == "distorted body image":
        synonyms.update(["dysmorphia", "misperception", "self-image issues", "body dissatisfaction"])
    elif symptom.lower() == "emotional instability":
        synonyms.update(["moodiness", "volatility", "variability", "impulsiveness", "unpredictability"])
    elif symptom.lower() == "fear of abandonment":
        synonyms.update(["separation anxiety", "rejection fear", "loneliness", "isolation"])
    elif symptom.lower() == "impulsive behavior":
        synonyms.update(["rashness", "recklessness", "haste", "spontaneity", "instinctiveness"])
    elif symptom.lower() == "self-harm":
        synonyms.update(["self-injury", "cutting", "wounding", "self-mutilation", "destructive behavior"])
    elif symptom.lower() == "difficulty falling asleep":
        synonyms.update(["restlessness", "wakefulness", "sleeplessness", "tossing", "turning"])
    elif symptom.lower() == "frequent night wakings":
        synonyms.update(["interruptions", "waking", "disruptions", "awakenings", "rousing"])
    elif symptom.lower() == "daytime fatigue":
        synonyms.update(["exhaustion", "tiredness", "weariness", "drowsiness", "lethargy"])
    elif symptom.lower() == "irritability":
        synonyms.update(["agitation", "annoyance", "frustration", "exasperation", "moodiness"])

    return synonyms 
def extract_symptoms(user_input, symptoms_list):
    phrases = smart_split(user_input)
    detected_symptoms = set()
    processed_input = preprocess_text(user_input)
    words = processed_input.split()

    # Add contextual pattern matching
    context_patterns = {
        "time_patterns": ["always", "often", "lately", "recently", "days", "weeks"],
        "intensity_patterns": ["very", "extremely", "so much", "really", "too"],
        "negative_patterns": ["can't", "don't", "won't", "not", "never"]
    }
    
    # Check for contextual patterns
    context_score = 0
    for pattern_type, patterns in context_patterns.items():
        if any(pattern in processed_input for pattern in patterns):
            context_score += 0.2  # Increase confidence based on context

    # Existing symptom matching logic
    for phrase in phrases:
        for symptom, expressions in symptom_expressions.items():
            for expression in expressions:
                processed_phrase = preprocess_text(phrase).split()
                processed_expression = preprocess_text(expression).split()
                common_words = set(processed_phrase).intersection(set(processed_expression))
                
                # Add confidence scoring based on context
                if len(common_words) >= 2:
                    confidence = (len(common_words) / len(processed_expression)) + context_score
                    if confidence > 0.5:  # Adjusted threshold
                        detected_symptoms.add(symptom)

    for symptom in symptoms_list:
        if symptom not in detected_symptoms:
            variants = set(w.lower() for w in get_symptom_variants(symptom))
            if any(word.lower() in variants for word in words):
                detected_symptoms.add(symptom)


    return detected_symptoms
def ask_about_symptom(symptom_name, symptom_data):
    yes_count = 0
    for i, question in enumerate(symptom_data["questions"]):
        answer = input(f"Chatbot: {question} (yes/no)\nYou: ").strip().lower()
        if "yes" in answer:
            yes_count += 1
            affirmation = symptom_data["affirmations"][min(i, len(symptom_data["affirmations"]) - 1)]
            print("💬 Chatbot:", affirmation)
        if yes_count >= 2:
            print(f"✅ Symptom confirmed: {symptom_name}")
            return True
    return False
# ✅ Extract all symptoms from the KG
def get_all_symptoms_from_kg(kg):
    """Retrieve all symptoms from the knowledge graph."""
    return [str(symptom).split("#")[-1] for symptom in kg.subjects(RDF.type, ex.Symptom)]
Anxiety = {
    "Excessive Worry": {
        "questions": [
            "Do you find yourself worrying excessively about different things?",
            "Is it hard to control or stop your worrying?",
            "Does your worry interfere with daily activities?"
        ],
        "affirmations": [
            "It's natural to worry, but you don't have to carry this burden alone. Your feelings are valid, and there are ways to manage these thoughts.",
            "Acknowledging your worries takes courage. Remember that you have the strength to face them, one step at a time.",
            "Your mind is trying to protect you, even if it feels overwhelming. Together, we can find ways to make these thoughts more manageable."
        ]
    },
    "Panic Attacks": {
        "questions": [
            "Have you experienced sudden intense fear or discomfort?",
            "Do you have physical symptoms during these episodes?",
            "Do you worry about having another panic attack?"
        ],
        "affirmations": [
            "Panic attacks can be scary, but they will pass. You're stronger than you know, and you're not alone in this.",
            "Your body's reactions are real, and they matter. We can work on understanding and managing these experiences together.",
            "Each breath you take during panic is an act of courage. You're doing the best you can, and that's enough."
        ]
    }
}

def demo_chat(lang='ar'):
    """Demonstrate the chatbot with a predefined conversation"""
    print("=== Starting HeadDoWell Chatbot Demo ===\n")
    
    # Simulate user input
    if lang == 'ar':
        user_input = "أشعر بالحزن والقلق كثيراً هذه الأيام ولدي صعوبة في النوم"
    elif lang == 'fr':
        user_input = "Je me sens très triste et anxieux ces jours-ci et j'ai du mal à dormir"
    else:
        user_input = "I've been feeling very sad and anxious lately and having trouble sleeping"
    
    # Run the chatbot with the simulated input
    mini_chatbot(lang, demo_input=user_input)

def mini_chatbot(lang='en', demo_input=None):
    # Initial welcome messages with more variety
    welcome_messages = [
        "Hi there! I'm HeadDoWell, your mental wellness companion. How have you been feeling lately?",
        "Hello! I'm HeadDoWell, and I'm here to listen and support you. How are you doing today?",
        "Welcome! I'm HeadDoWell. This is a safe space to share whatever's on your mind. How have things been for you?"
    ]
    
    print(random.choice(welcome_messages))
    
    conversation_count = 0
    confirmed_symptoms = []
    user_responses = []

    while conversation_count < 3:  # Have at least 3 exchanges before analysis
        if demo_input and conversation_count == 0:
            user_input = demo_input
        else:
            user_input = input("\nYou: ")
        
        user_responses.append(user_input)
        
        # Supportive follow-up responses
        follow_ups = [
            "I hear you. Could you tell me more about that?",
            "That sounds challenging. How long have you been feeling this way?",
            "Thank you for sharing that. Would you like to elaborate?",
            "I understand this isn't easy to talk about. What else is on your mind?"
        ]
        
        if conversation_count < 2:
            print(f"\nHeadDoWell: {random.choice(follow_ups)}")
        
        conversation_count += 1

    # Process all responses together for better context
    all_symptoms = get_all_symptoms_from_kg(g)
    all_user_input = " ".join(user_responses)
    detected = extract_symptoms(all_user_input, all_symptoms)

    # More natural symptom confirmation
    if detected:
        print("\n🤗 Thank you for sharing all of this with me. I notice some patterns in what you're sharing:")
        
        # Calculate disorder confidence scores
        disorder_scores = analyze_disorders(detected, user_responses)
        
        # Present findings more naturally
        for disorder, confidence in disorder_scores.items():
            if confidence > 30:
                severity = "significant" if confidence > 75 else "moderate" if confidence > 50 else "mild"
                print(f"\n• I'm noticing patterns that align with {disorder} ({severity} - {confidence:.0f}% confidence)")
                
        print("\n💭 Remember: This is a supportive conversation, not a clinical diagnosis.")
        print("\nWould you like to:")
        print("1. Talk more about these feelings")
        print("2. Learn about some coping strategies")
        print("3. Explore professional support options")
        print("4. Just continue our conversation")
        
        if not demo_input:
            choice = input("\nWhat feels right for you? (1-4): ")
            handle_user_choice(choice, disorder_scores)
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet') 
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
def suggest_coping_strategies(disorder_scores):
    """Suggest personalized coping strategies based on detected disorders."""
    print("\nHeadDoWell: Let me share some strategies that might help:\n")
    
    for disorder, confidence in disorder_scores.items():
        if disorder == "Depression":
            print("🌱 For managing depressive symptoms:")
            print("• Establish a gentle daily routine")
            print("• Take small steps outside, even just for fresh air")
            print("• Connect with someone you trust")
            print("• Practice self-compassion - be kind to yourself")
            print("• Try to engage in art or activities you used to enjoy, even for just 5 minutes\n")
        
        elif disorder == "Anxiety":
            print("🧘 For managing anxiety:")
            print("• Try deep breathing exercises (4-7-8 breathing)")
            print("• Ground yourself using the 5-4-3-2-1 technique")
            print("• Write down your worries to release them")
            print("• Create a calming playlist\n")
    
    print("Would you like to explore any of these strategies together? Or would you prefer to talk about something else?")

def suggest_professional_support(disorder_scores):
    """Provide information about professional support options."""
    print("\nHeadDoWell: Thank you for being open to exploring professional support. Here are some options to consider:\n")
    
    print("🤝 General recommendations:")
    print("• Consider speaking with a mental health professional")
    print("• Your primary care physician can be a good starting point")
    print("• Many therapists offer online sessions for convenience")
    print("• Support groups can provide community understanding\n")
    
    print("💡 Remember: Seeking help is a sign of strength, not weakness.\n")
    print("Would you like information about crisis helplines or local mental health resources?")

def analyze_disorders(detected_symptoms, user_responses):
    """Analyze detected symptoms to determine potential disorders."""
    disorder_scores = {}
    
    # Combine all user responses for sentiment analysis
    combined_text = " ".join(user_responses)
    sentiment_data = analyze_sentiment(combined_text)
    
    for disorder, symptoms in disorders.items():
        # Calculate how many symptoms match
        matching_symptoms = set(symptoms).intersection(detected_symptoms)
        if matching_symptoms:
            # Base confidence score on percentage of matching symptoms
            confidence = (len(matching_symptoms) / len(symptoms)) * 100
            
            # Adjust confidence based on sentiment intensity
            confidence += sentiment_data['intensity'] * 20
            
            # Normalize confidence score
            confidence = min(confidence, 100)
            
            disorder_scores[disorder] = confidence
    
    return disorder_scores

def handle_user_choice(choice, disorder_scores):
    """Handle user's choice of how to proceed with the conversation."""
    if choice == "1":
        print("\nHeadDoWell: I appreciate you wanting to talk more. Sometimes sharing our feelings can help us understand them better.")
        
        # Ask more specific questions based on detected disorders
        for disorder, confidence in disorder_scores.items():
            if confidence > 30:
                print("\nCould you tell me more about:")
                print("• When these feelings started?")
                print("• What makes them feel stronger or lighter?")
                print("• How are they affecting your daily life?")
                
                response = input("\nYou: ")
                print("\nHeadDoWell: Thank you for sharing that. Your feelings are valid, and it takes courage to talk about them.")
                print("Would you like to explore some gentle ways to cope with these feelings?")
    
    elif choice == "2":
        suggest_coping_strategies(disorder_scores)
    
    elif choice == "3":
        print("\nHeadDoWell: It's brave of you to consider professional support. Here are some options:")
        print("• Speaking with a mental health professional")
        print("• Consulting with your primary care physician")
        print("• Exploring therapy options (in-person or online)")
        print("• Joining support groups")
        print("\nWould you like information about local mental health resources?")
    
    elif choice == "4":
        print("\nHeadDoWell: I'm here to listen. What's on your mind?")