const { fetchTopics, fetchApiInfo } = require("../model/model.js");
const endpointInfo = require("../../endpoints.json");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.explainApi = (req, res, next) => {
  // console.log("CONTROLLER");
  res.status(200).send(endpointInfo);
};
