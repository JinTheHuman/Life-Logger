const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const app = express();
app.use(cors(corsOptions));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "..", "build")));

// API endpoint to read a file
app.get("/api/readFile", (req, res) => {
  const filePath = "log.txt";
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }
    res.send(data);
  });
});

// API endpoint to write to a file
app.post("/api/writeFile", jsonParser, (req, res) => {
  const filePath = "log.txt";
  const data = req.body;
  console.log("Received data:", data[0].chapters);

  const newData = JSON.stringify(data);

  fs.writeFile(filePath, newData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error writing to file");
      return;
    }
    res.send("File written successfully");
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
