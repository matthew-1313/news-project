const db = require("../connection");
const { createRef } = require("../utils/utils");

exports.fetchTopics = () => {
  let query = `SELECT * FROM topics;`;
  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  let query = `
  SELECT * FROM articles
  WHERE article_id = $1;`;
  return db.query(query, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "article not found" });
    } else {
      return rows[0];
    }
  });
};

exports.fetchArticles = () => {
  let articleQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.body) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id 
  ORDER BY created_at DESC;`;
  return db.query(articleQuery).then((articleResult) => {
    const articleArray = articleResult.rows;
    return articleArray;
  });
};
