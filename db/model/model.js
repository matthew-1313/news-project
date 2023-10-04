const db = require("../connection");

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
  console.log("MODEL");
  let articleQuery = `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC;`;
  return db.query(articleQuery).then((articleResult) => {
    //console.log(articleResult.rows);
    articleResult.rows.forEach((article) => {
      article.comment_count = 0;
    });
    //console.log(articleResult.rows);
    let commentQuery = `SELECT article_id FROM comments;`;
    return db.query(commentQuery).then((commentResult) => {
      const commentArray = commentResult.rows;
      console.log(commentArray);
      // foreach id in commentArray: article with equal article_id +=1
    });
  });
};
