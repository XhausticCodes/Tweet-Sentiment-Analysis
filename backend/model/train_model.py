# backend/model/train_model.py
import pandas as pd
import re
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load dataset
df = pd.read_csv("dataset/sentiment140.csv", encoding='latin-1', header=None)
df = df[[0, 5]]
df.columns = ['label', 'text']

# Convert labels: 0 -> negative, 4 -> positive
df['label'] = df['label'].apply(lambda x: 0 if x == 0 else 1)

# Clean tweets
def clean_text(text):
    text = re.sub(r"http\S+|www\S+|@\S+|#\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = text.lower()
    return text

df['text'] = df['text'].apply(clean_text)

# Vectorize
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['text'])
y = df['label']

# Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)

# Save model and vectorizer
with open("backend/model/saved_model.pkl", "wb") as f:
    pickle.dump((model, vectorizer), f)

print("Model trained and saved.")