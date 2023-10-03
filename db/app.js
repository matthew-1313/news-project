const express = require("express");
const app = express();
const {
  getTopics,
  explainApi,
  articlesById,
} = require("./controller/controller.js");

app.get("/api/topics", getTopics);

app.get("/api", explainApi);

app.get("/api/articles/:article_id", articlesById);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
