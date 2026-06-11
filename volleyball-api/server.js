const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("SERVER STARTED");

// ROUTES
app.use("/players", require("./routes/players"));
app.use("/stats", require("./routes/stats"));
app.use("/matches", require("./routes/matches"));

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(5000, () => {
  console.log("SERVER RUNNING ON 5000");
});