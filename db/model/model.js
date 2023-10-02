const db = require("../connection");

exports.fetchTopics = () => {
  //console.log("MODEL");
  let query = `SELECT * FROM topics;`;
  return db.query(query).then((result) => {
    //console.log(result.rows);
    return result.rows;
  });
};
