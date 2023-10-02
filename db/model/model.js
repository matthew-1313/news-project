const db = require("../connection");
const endpointInfo = require("../../endpoints.json");

exports.fetchTopics = () => {
  let query = `SELECT * FROM topics;`;
  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.fetchApiInfo = () => {
  console.log("MODEL");
  //function that reads endpointInfo (fs promises)  utf-8 is involved
  // .then make the data parsed
  return; //parsed data;
};
