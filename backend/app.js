const express = require("express");
const cors = require("cors");
const sentimentRoute = require("./routes/sentiment");
const tweetRoutes = require("./routes/tweets");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", sentimentRoute);
app.use("/api/tweets", tweetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

