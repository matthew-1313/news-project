const { fetchTopics, fetchArticles } = require("../model/model.js");
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
  //console.log("CONTROLLER");
  const { article_id } = req.params;
  return fetchArticles(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
