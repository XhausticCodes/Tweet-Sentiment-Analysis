# backend/model/predict.py
import sys
import pickle
import re
import json

def clean_text(text):
    text = re.sub(r"http\S+|www\S+|@\S+|#\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    return text.lower()

def predict_sentiment(tweet):
    with open("backend/model/saved_model.pkl", "rb") as f:
        model, vectorizer = pickle.load(f)

    cleaned = clean_text(tweet)
    vect = vectorizer.transform([cleaned])
    pred = model.predict(vect)[0]
    return "positive" if pred == 1 else "negative"

if __name__ == "__main__":
    tweet = sys.argv[1]
    result = predict_sentiment(tweet)
    print(json.dumps({"sentiment": result}))
