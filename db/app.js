const express = require("express");
const app = express();
const { getTopics } = require("./controller/controller.js");

app.use((err, req, res, next) => {
  //console.log(err);
  res.status(500).send({ message: "internal server error" });
});

app.get("/api/topics", getTopics);

module.exports = app;
