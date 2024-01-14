const express = require("express");
const { connectDB } = require("./db/index");
const dotenv = require("dotenv");
dotenv.config({
  path: "./env",
});

const app = express();

connectDB()
  .then(() => {
    app.listen(
      process.env.PORT || 8000,
      `Listening on port ${process.env.PORT}`
    );
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });
