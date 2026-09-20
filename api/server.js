// Loads the values from the .env file into process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); // lets the frontend (a different site) call this API
app.use(express.json()); // lets us read JSON sent in POST requests

// ROUTES
app.use("/players", require("./routes/players"));
app.use("/stats", require("./routes/stats"));
app.use("/matches", require("./routes/matches"));

// Simple check that the API is up
app.get("/", (req, res) => {
  res.send("API working");
});

// Hosting sites (like Render) pick the port for us; locally we use 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});
