const { fetchTopics } = require("../model/model.js");

exports.getTopics = (req, res, next) => {
  //console.log("CONTROLLER");
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
