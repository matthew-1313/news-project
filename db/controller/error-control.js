exports.sqlErrors = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "missing object key" });
  } else if (err.code === "23503") {
    res.status(400).send({ message: "user not found" });
  } else if (err.code === "22P02") {
    res.status(400).send({ message: "bad request" });
  } else {
    next(err);
  }
};
//

//
exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};
//

//
exports.handle500Error = (err, req, res, next) => {
  console.log(err, "internal server error");
  res.status(500).send({ message: "internal server error" });
};
