from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from detoxify import Detoxify
import torch

app = FastAPI()

# Load model at startup
# 'original' is the standard BERT-based model
print("Loading Detoxify model...")
model = Detoxify('original')
print("Model loaded!")

class ModerationRequest(BaseModel):
    text: str

@app.post("/moderate")
async def moderate(request: ModerationRequest):
    try:
        results = model.predict(request.text)
        
        # Convert numpy/torch floats to python floats
        scores = {k: float(v) for k, v in results.items()}
        
        # Decision Logic
        action = "allow"
        labels = []
        
        # Thresholds
        if scores['severe_toxicity'] > 0.8:
            action = "block"
            labels.append("severe_toxicity")
        elif scores['toxicity'] > 0.7:
            action = "flag"
            labels.append("toxicity")
        elif scores['obscene'] > 0.8:
            action = "flag"
            labels.append("obscene")
        elif scores['threat'] > 0.8:
            action = "block"
            labels.append("threat")
        elif scores['insult'] > 0.8:
            action = "flag"
            labels.append("insult")
        elif scores['identity_attack'] > 0.8:
            action = "block"
            labels.append("identity_attack")
            
        return {
            "action": action,
            "labels": labels,
            "scores": scores
        }
        
    except Exception as e:
        print(f"Error during moderation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "AI Service is running"}
