from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = tf.keras.models.load_model("dzienczesc.keras") #change, from db depends on lecture
    actions = ["Dzień", "Dobry", "Cześć"] #change, random for tests
except Exception as e:
    raise RuntimeError(f"Błąd podczas ładowania modelu: {e}")


class KeypointsRequest(BaseModel):
    keypoints: list[list[list[float]]]


@app.get("/")
def read_root():
    file_path = "C:/Users/dell/Desktop/MigAI/data/hello/0.npy" #change
    data = np.load(file_path)

    a = ("Kształt tablicy:", data.shape)
    return {"Kształt tablicy": "data.shape"}


@app.post("/predict/")
async def predict(request: KeypointsRequest):
    try:
        keypoints = np.array(request.keypoints, dtype=np.float32)

        if keypoints.shape != (1, 30, 1662):
            raise HTTPException(status_code=400,
                                detail=f"Nieprawidłowy format danych. Otrzymano {keypoints.shape}, oczekiwano (1, 30, 1662).")

        predictions = model.predict(keypoints)[0]  # shape (3,)
        best_idx = int(np.argmax(predictions))
        best_score = float(predictions[best_idx])

        THRESHOLD = 0.60
        if best_score < THRESHOLD:
            return {"predictedSign": "Nie rozpoznano", "score": best_score}

        return {"predictedSign": actions[best_idx], "score": best_score}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd przetwarzania: {str(e)}")
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    print("🔥 Rozgrzewanie modelu...")
    dummy_input = np.random.random((1, 30, 1662)).astype(np.float32)
    model.predict(dummy_input)
    print("✅ Model rozgrzany!")