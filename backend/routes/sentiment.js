const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path"); // ✅ Required for cross-platform safe paths

router.post("/predict", (req, res) => {
  const tweet = req.body.tweet;

  if (!tweet) return res.status(400).json({ error: "No tweet provided" });

  // ✅ Build absolute path to predict.py
  const scriptPath = path.join(__dirname, "..", "model", "predict.py");

  const process = spawn("python", [scriptPath, tweet]);

  let result = "";
  process.stdout.on("data", (data) => {
    result += data.toString();
  });

  process.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  process.on("close", (code) => {
    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch (err) {
      console.error("Parsing error:", err);
      res.status(500).json({ error: "Prediction failed" });
    }
  });
});

module.exports = router;
