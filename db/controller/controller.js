const { fetchTopics, fetchApiInfo } = require("../model/model.js");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.explainApi = (req, res, next) => {
  console.log("CONTROLLER");
  return fetchApiInfo()
    .then((info) => {
      console.log(info);
      res.status(200).send({ info });
    })
    .catch(next);
};
