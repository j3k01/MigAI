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
    model = tf.keras.models.load_model("actionHaveDayHelp.h5") #change, from db depends on lecture
    actions = ["Mieć", "Dziękuję", "Przepraszam"] #change, random for tests
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

        if keypoints.shape != (1, 30, 258):
            raise HTTPException(status_code=400,
                                detail=f"Nieprawidłowy format danych. Otrzymano {keypoints.shape}, oczekiwano (1, 30, 1662).")

        predictions = model.predict(keypoints)
        predicted_index = int(np.argmax(predictions))

        return {"predictedSign": actions[predicted_index]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd przetwarzania: {str(e)}")
