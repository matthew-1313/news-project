const express = require("express");
const app = express();
const {
  getTopics,
  explainApi,
  articlesById,
  getArticles,
} = require("./controller/controller.js");
const {
  sqlErrors,
  customErrors,
  handle500Error,
} = require("./controller/error-control.js");
//

//paths
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", explainApi);

app.get("/api/articles/:article_id", articlesById);

app.get("/api/articles", getArticles);
//bad path
app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "invalid file path" });
});
//

//errors
app.use(sqlErrors);
app.use(customErrors);
app.use(handle500Error);

module.exports = app;
