const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
} = require("../model/model.js");
const endpointInfo = require("../../endpoints.json");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.explainApi = (req, res, next) => {
  res.status(200).send(endpointInfo);
};

exports.articlesById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  console.log("CONTROLLER");
  return fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
