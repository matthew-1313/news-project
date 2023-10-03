const db = require("../connection");

exports.fetchTopics = () => {
  let query = `SELECT * FROM topics;`;
  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = (article_id) => {
  //console.log("MODEL");
  let query = `
  SELECT * FROM articles
  WHERE article_id = $1;`;
  return db.query(query, [article_id]).then(({ rows }) => {
    return rows[0];
  });
};
