import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { sentimentAPI, tweetAPI } from "./api";
import "./App.css";

function App() {
  const [tweet, setTweet] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [showSentiment, setShowSentiment] = useState(false);

  const [query, setQuery] = useState("");
  const [liveTweets, setLiveTweets] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);

  

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tweetHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.forEach((item) => (item.time = new Date(item.time)));
      setHistory(parsed);
    }
  }, []);

  const handlePredict = async () => {
    console.log("handlePredict called with tweet:", tweet);
    if (!tweet.trim()) {
      console.log("Tweet is empty, returning");
      return;
    }

    try {
      console.log("Starting prediction...");
      setLoading(true);
      setShowSentiment(false); // hide current sentiment before new one comes
      setSentiment("");

      console.log("Calling sentimentAPI.predict...");
      const response = await sentimentAPI.predict(tweet);
      console.log("API response:", response);
      const prediction = response.data.sentiment;

      setSentiment(prediction);
      setShowSentiment(true);
      setTimeout(() => setShowSentiment(false), 10000); // 12 seconds

      const updatedHistory = [
        { text: tweet, sentiment: prediction, time: new Date() },
        ...history.slice(0, 4),
      ];
      setHistory(updatedHistory);
      localStorage.setItem("tweetHistory", JSON.stringify(updatedHistory));
      setHighlightedIndex(0);
      setTimeout(() => setHighlightedIndex(null), 2000);
      setTweet("");
    } catch (err) {
      console.error("Prediction failed:", err);
      setSentiment("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAndPredictLiveTweets = async () => {
    if (!query.trim()) return;
    setLiveLoading(true);
    setLiveTweets([]);

    try {
      const tweetRes = await tweetAPI.search(query);
      const rawTweets = tweetRes.data.tweets || [];

      const predictions = await Promise.all(
        rawTweets.map(async (tweet) => {
          const response = await sentimentAPI.predict(tweet.text);
          const prediction = response.data.sentiment;

          return {
            ...tweet,
            sentiment: prediction,
          };
        })
      );

      setLiveTweets(predictions);
    } catch (error) {
      console.error("Live tweet prediction failed:", error);

      if (error.response?.status === 429) {
        toast.error("Rate limit exceeded. Please wait a few minutes.");
      } else {
        toast.error("Error fetching or predicting tweets");
      }
    } finally {
      setLiveLoading(false);
    }
  };

  const getSentimentColor = () => {
    if (sentiment === "positive") return "text-green-400";
    if (sentiment === "negative") return "text-red-400";
    if (sentiment === "neutral") return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <motion.div
      //Style 1 : Top gradient
      // className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white flex flex-col items-center justify-center px-4 py-8 font-mono"
      // style={{
      //   background:
      //     "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 90%), #000000",
      // }}

      //Style 2 centric gradient
      // className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8 font-mono"
      // style={{
      //   backgroundImage: `
      //     radial-gradient(circle at center, #4e18f0, transparent)
      //   `,
      // }}

      //style 3: dark white dot grid
      // className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white flex flex-col items-center justify-center px-4 py-8 font-mono"
      // style={{
      //   background: "#000000",
      //   backgroundImage: `
      //     radial-gradient(circle, rgba(79, 70, 229, 0.4) 1.5px, transparent 1.5px)
      //   `,
      //   backgroundSize: "30px 30px",
      //   backgroundPosition: "0 0",
      // }}

      //Style Combination of 1 and 3:
      // className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white flex flex-col items-center justify-center px-4 py-8 font-mono"
      // style={{
      //   backgroundColor: "#000000",
      //   backgroundImage: `
      //     radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 90%),
      //     radial-gradient(circle, rgba(79, 70, 229, 0.35) 1.5px, transparent 1.5px)
      //   `,
      //   backgroundSize: "100% 100%, 30px 30px",
      //   backgroundPosition: "center, 0 0",
      // }}

      //Circular Moving dots effect
      //   className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white flex flex-col items-center justify-center px-4 py-8 font-mono animated-bg"
      //   style={{
      //     backgroundColor: "#000000",
      //     backgroundImage: `
      //   radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 90%),
      //   radial-gradient(circle, rgba(79, 70, 229, 0.35) 1.5px, transparent 1.5px)
      // `,
      //     backgroundSize: "100% 100%, 30px 30px",
      //     backgroundPosition: "center, 0px 0px",
      //   }}

      className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white flex flex-col items-center justify-center px-4 py-8 font-mono"
      style={{
        backgroundColor: "#000000",
        backgroundImage: `
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 90%),
      radial-gradient(circle, rgba(79, 70, 229, 0.35) 1.5px, transparent 1.5px)
    `,
        backgroundSize: "100% 100%, 30px 30px",
      }}
      animate={{
        backgroundPosition: [
          "center, 100px 0px", // 0°
          "center, 92px 38px", // 22.5°
          "center, 70px 70px", // 45°
          "center, 38px 92px", // 67.5°
          "center, 0px 100px", // 90°
          "center, -38px 92px", // 112.5°
          "center, -70px 70px", // 135°
          "center, -92px 38px", // 157.5°
          "center, -100px 0px", // 180°
          "center, -92px -38px", // 202.5°
          "center, -70px -70px", // 225°
          "center, -38px -92px", // 247.5°
          "center, 0px -100px", // 270°
          "center, 38px -92px", // 292.5°
          "center, 70px -70px", // 315°
          "center, 92px -38px", // 337.5°
          "center, 100px 0px", // back to 0°
        ],
      }}
      transition={{
        duration: 60, // make it slower for elegance
        ease: "linear", // constant speed
        repeat: Infinity,
      }}
    >
      <Toaster position="top-center" />

      <motion.h1
        className="text-4xl font-bold mb-6 text-white tracking-wide flex items-center gap-2 drop-shadow-[0_0_15px_rgba(129,140,248,0.65)]"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        Tweet Sentiment Predictor 💬
      </motion.h1>

      <motion.div
        className="w-full max-w-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          onKeyDown={(e) => {
            console.log(
              "Key pressed:",
              e.key,
              "Shift:",
              e.shiftKey,
              "Ctrl:",
              e.ctrlKey
            );
            if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
              console.log("Enter pressed, calling handlePredict");
              e.preventDefault();
              handlePredict();
            }
          }}
          placeholder="Type a tweet like 'I love this movie'..."
          className="w-full p-4 bg-zinc-900 text-white border border-zinc-700 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          rows="4"
        />

        <motion.button
          onClick={() => {
            console.log("Button clicked, calling handlePredict");
            handlePredict();
          }}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 py-3 px-6 text-lg rounded-xl font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(129,140,248,0.6)]"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.03 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" /> Predicting...
            </span>
          ) : (
            "Predict Sentiment"
          )}
        </motion.button>

        <AnimatePresence>
          {sentiment && showSentiment && (
            <motion.div
              key={sentiment}
              className={`mt-6 text-2xl font-semibold text-center ${getSentimentColor()}`}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              transition={{ duration: 0.8 }}
            >
              Prediction: {sentiment}
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <motion.div
            className="mt-10 w-full max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              Prediction History
            </h2>
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {history.map((item, index) => (
                  <motion.li
                    key={item.time}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-lg"
                  >
                    <div>
                      <p className="text-sm text-gray-400 break-words max-w-xs">
                        "{item.text}"
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.time.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <span
                        className={`text-sm font-bold ${
                          item.sentiment === "positive"
                            ? "text-green-400"
                            : item.sentiment === "negative"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {item.sentiment}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.text);
                          toast.success("Tweet copied to clipboard!", {
                            duration: 3000,
                          });
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => {
                          const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            item.text +
                              " #Sentiment: " +
                              item.sentiment +
                              " \nThanks @kirat_tw and @striver_79"
                          )}`;
                          window.open(tweetUrl, "_blank");
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        🔗
                      </button>
                      <button
                        onClick={() => {
                          const updated = history.filter((_, i) => i !== index);
                          setHistory(updated);
                          localStorage.setItem(
                            "tweetHistory",
                            JSON.stringify(updated)
                          );
                          toast("Deleted from history", {
                            icon: "🗑️",
                            duration: 3000,
                          });
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        ❌
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        )}

        {/* Live Tweet Feed Section */}
        <motion.div
          className="mt-14 w-full max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-300">
            Live Tweet Feed
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search live tweets (e.g. 'elon musk')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none"
            />
            <button
              onClick={fetchAndPredictLiveTweets}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm shadow-[0_0_12px_rgba(129,140,248,0.4)]"
            >
              {liveLoading ? "Loading..." : "Fetch"}
            </button>
          </div>

          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {liveTweets.map((tweet) => (
                <motion.li
                  key={tweet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-sm"
                >
                  <p className="text-sm text-white">"{tweet.text}"</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(tweet.created_at).toLocaleTimeString()}
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      tweet.sentiment === "positive"
                        ? "text-green-400"
                        : tweet.sentiment === "negative"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {tweet.sentiment}
                  </p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default App;