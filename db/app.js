const express = require("express");
const app = express();
const { getTopics } = require("./controller/controller.js");

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  //console.log(err);
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
