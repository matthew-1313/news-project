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
  let articleQuery = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.body) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id 
  ORDER BY created_at DESC;`;
  return db.query(articleQuery).then((articleResult) => {
    const articleArray = articleResult.rows;
    return articleArray;
  });
};

exports.fetchComments = (articleId) => {
  const article = articleId.article_id;
  let articleQuery = `
  SELECT * FROM articles
  WHERE article_id = $1;`;
  let commentQuery = `
  SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at ASC;`;
  return db
    .query(articleQuery, [article])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      } else {
        return db.query(commentQuery, [article]);
      }
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 200,
          message: "no comments on this article",
        });
      } else {
        return rows;
      }
    });
};

exports.makeAComment = (articleId, comment) => {
  const article = articleId;
  const user = comment.username;
  const postedComment = comment.body;
  let articleQuery = `
  SELECT * FROM articles
  WHERE article_id = $1;`;
  let userQuery = `
  SELECT * FROM users
  WHERE username = $1;`;
  let insertQuery = `
  INSERT INTO comments
  (body, author, article_id)
  VALUES ($1, $2, $3)
  RETURNING *;`;
  return db.query(articleQuery, [article]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "article not found" });
    } else {
      return db
        .query(insertQuery, [postedComment, user, article])
        .then((result) => {
          return result.rows[0];
        });
    }
  });
};

exports.changeVotes = (articleId, inc_votes) => {
  const article = articleId;
  const newVotes = inc_votes.inc_votes;

  if (newVotes === 0) {
    let query = `
    SELECT * FROM articles
    WHERE article_id = $1;`;
    return db.query(query, [article]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      } else {
        return rows[0];
      }
    });
  } else {
    let voteQuery = `
    SELECT votes FROM articles
    WHERE article_id = $1;`;
    return db.query(voteQuery, [article]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      } else {
        const currentVotes = rows[0].votes;
        const updatedVotes = currentVotes + newVotes;

        let upDatequery = `
        UPDATE articles
        SET votes = $1
        WHERE article_id = $2
        RETURNING *;`;
        return db
          .query(upDatequery, [updatedVotes, article])
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
  }
};
