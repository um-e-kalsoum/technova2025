# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64, io, pickle
import numpy as np
import cv2
from PIL import Image
import mediapipe as mp
from pathlib import Path  # 👈 added

app = FastAPI()

# Dev: allow Vite on 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImagePayload(BaseModel):
    image: str  # "data:image/jpeg;base64,..."

# ---- Load model once (path relative to this file) ----
HERE = Path(__file__).resolve().parent
MODEL_PATH = HERE / "model.p"

try:
    with open(MODEL_PATH, "rb") as f:
        model_dict = pickle.load(f)
    model = model_dict["model"]
    MODEL_OK = True
    print(f"Model loaded from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model from {MODEL_PATH}: {e}")
    model = None
    MODEL_OK = False

# ---- MediaPipe (tracking for video) ----
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    min_detection_confidence=0.3,
    min_tracking_confidence=0.3,
    max_num_hands=1,
)

labels_dict = {
    0: "Question", 1: "Water", 2: "Help", 3: "I Love You", 4: "Hello",
    5: "Thanks", 6: "A", 7: "Want", 8: "I", 9: "Yes",
}

@app.get("/api/health")
def health():
    return {
        "status": "healthy" if MODEL_OK else "degraded",
        "model_loaded": MODEL_OK,
        "supported_signs": list(labels_dict.values()),
    }

@app.post("/api/predict")
def predict(payload: ImagePayload):
    if not MODEL_OK:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # strip "data:image/...;base64,"
    try:
        b64 = payload.image.split(",", 1)[1]
    except IndexError:
        raise HTTPException(status_code=400, detail="Invalid data URL")

    # decode to RGB frame
    try:
        img_bytes = base64.b64decode(b64)
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        H, W, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Bad image: {e}")

    # run MediaPipe
    results = hands.process(frame_rgb)
    if not results.multi_hand_landmarks:
        return {"prediction": "No hand detected", "confidence": "none"}

    data_aux, xs, ys = [], [], []
    for hand_landmarks in results.multi_hand_landmarks:
        for lm in hand_landmarks.landmark:
            xs.append(lm.x); ys.append(lm.y)
            data_aux.extend([lm.x, lm.y])

    if len(data_aux) != 42:  # 21 landmarks * 2
        raise HTTPException(status_code=400, detail="Invalid landmarks length")

    pred = model.predict([np.asarray(data_aux)])
    label = labels_dict.get(int(pred[0]), "Unknown")

    x1 = int(min(xs) * W) - 10
    y1 = int(min(ys) * H) - 10
    x2 = int(max(xs) * W) + 10
    y2 = int(max(ys) * H) + 10

    return {
        "prediction": label,
        "confidence": "high",
        "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
    }
