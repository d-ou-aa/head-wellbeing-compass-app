from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from nlp import analyze_sentiment, calculate_confidence_score, assess_severity, disorders, symptom_expressions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "Accept-Language", "Content-Length", "X-Requested-With"],
    expose_headers=["Content-Type", "Authorization", "Content-Length"],
    max_age=3600
)

class MessageInput(BaseModel):
    text: str

class ConfidenceScore(BaseModel):
    overall_confidence: float
    semantic_similarity: float
    fuzzy_match: float
    sentiment_intensity: float

class Symptom(BaseModel):
    symptom: str
    disorder: str
    confidence: ConfidenceScore

class Sentiment(BaseModel):
    sentiment: str
    intensity: float
    scores: Dict[str, float]

class SeverityAssessment(BaseModel):
    level: str
    score: float
    description: Dict[str, str]

class NLPResponse(BaseModel):
    sentiment: Sentiment
    detected_symptoms: List[Symptom]
    severity_assessment: Optional[SeverityAssessment]
    confidence_scores: Dict[str, float]

@app.post("/analyze", response_model=NLPResponse)
async def analyze_message(message: MessageInput):
    if not message.text.strip():
        raise HTTPException(status_code=400, detail="Message text cannot be empty")

    if len(message.text) > 5000:
        raise HTTPException(status_code=400, detail="Message text is too long. Maximum length is 5000 characters")

    try:
        # Analyze sentiment
        sentiment_analysis = analyze_sentiment(message.text)
        
        # Detect symptoms
        detected_symptoms = []
        for symptom, expressions in symptom_expressions.items():
            confidence = calculate_confidence_score(message.text, " ".join(expressions))
            if confidence['overall_confidence'] > 0.3:  # Confidence threshold
                for disorder, symptoms in disorders.items():
                    if symptom in symptoms:
                        detected_symptoms.append({
                            'symptom': symptom,
                            'disorder': disorder,
                            'confidence': confidence
                        })
        
        # Assess severity if symptoms were detected
        severity = None
        if detected_symptoms:
            severity = assess_severity({
                'confidence': max([s['confidence']['overall_confidence'] for s in detected_symptoms]),
                'sentiment': sentiment_analysis
            })
        
        return NLPResponse(
            sentiment=sentiment_analysis,
            detected_symptoms=detected_symptoms,
            severity_assessment=severity,
            confidence_scores={'max_confidence': max([s['confidence']['overall_confidence'] for s in detected_symptoms]) if detected_symptoms else 0}
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Log the error here in production
        print(f"Error processing message: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your message. Please try again later."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)