const express = require("express");
const app = express();
const {
  getTopics,
  explainApi,
  articlesById,
  getArticleComments,
  getArticles,
  postComment,
  patchArticleById,
  deleteComment,
} = require("./controller/controller.js");
const {
  sqlErrors,
  customErrors,
  handle500Error,
} = require("./controller/error-control.js");
//

app.use(express.json());
//paths
app.get("/api/topics", getTopics);

app.get("/api", explainApi);

app.get("/api/articles/:article_id", articlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/articles", getArticles);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteComment);
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
