const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

router.get("/search", (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).json({ error: "Query is required" });

  const python = spawn("python", ["backend/model/fetch_tweets.py", query]);

  let output = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  python.on("close", (code) => {
    try {
      const tweets = JSON.parse(output);
      res.json({ tweets });
    } catch (err) {
      console.error("Parse error:", err);
      res.status(500).json({ error: "Failed to fetch tweets" });
    }
  });
});

module.exports = router;
