import tweepy
import sys
import json
from dotenv import load_dotenv
import os

load_dotenv()

BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")

client = tweepy.Client(bearer_token=BEARER_TOKEN)


def fetch_recent_tweets(query, max_results=10):
    tweets = client.search_recent_tweets(query=query, max_results=max_results, tweet_fields=["created_at", "text"])
    return tweets.data if tweets.data else []

if __name__ == "__main__":
    query = sys.argv[1]
    results = fetch_recent_tweets(query)
    print(json.dumps([{"text": t.text, "created_at": str(t.created_at), "id": t.id} for t in results]))
