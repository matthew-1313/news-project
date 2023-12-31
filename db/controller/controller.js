const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchComments,
  makeAComment,
  changeVotes,
  removeComment,
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

exports.postComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const comment = req.body;
  return makeAComment(articleId, comment)
    .then((newComment) => {
      res.status(200).send({ newComment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  const newVotes = req.body.inc_votes;
  if (newVotes === 0) {
    return fetchArticleById(articleId)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  } else {
    return changeVotes(articleId, newVotes)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  return removeComment(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
