const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchComments,
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
  return fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const articleId = req.params;
  return fetchComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
