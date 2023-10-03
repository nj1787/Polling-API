const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // Require mongoose
const app = express();

app.use(bodyParser.json());
app.use("/questions", require("./routes/questions"));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb://localhost:27017/pollDb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server after successful MongoDB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
