const db = require("../db/connection");
const app = require("../db/app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpointInfo = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET/api/topics", () => {
  test("200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("responds with array of correct topic objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(typeof topic.slug).toBe("string");
          expect(topic.hasOwnProperty("description")).toBe(true);
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET/api", () => {
  test("200 status code", () => {
    return request(app).get("/api").expect(200);
  });
  test("returns object explaining api paths", () => {
    return request(app)
      .get("/api")
      .then(({ body }) => {
        expect(body).toEqual(endpointInfo);
      })
      .catch();
  });
});

describe("GET/api/articles/:article_id", () => {
  test("200 status code", () => {
    return request(app).get("/api/articles/2").expect(200);
  });
  test("returns correct article with all properties", () => {
    return request(app)
      .get("/api/articles/2")
      .then(({ body }) => {
        expect(body.article.hasOwnProperty("article_id")).toBe(true);
        expect(body.article.article_id).toBe(2);
        expect(body.article.hasOwnProperty("author")).toBe(true);
        expect(body.article.hasOwnProperty("title")).toBe(true);
        expect(body.article.hasOwnProperty("body")).toBe(true);
        expect(body.article.hasOwnProperty("topic")).toBe(true);
        expect(body.article.hasOwnProperty("created_at")).toBe(true);
        expect(body.article.hasOwnProperty("votes")).toBe(true);
      })
      .catch();
  });
});

// describe("GET/api/articles", () => {
//   test("200 status code", () => {
//     return request(app).get("/api/articles").expect(200);
//   });
//   test("responds with array of correct article objects", () => {
//     return request(app)
//       .get("/api/articles")
//       .then(({ body }) => {
//         expect(body.articles).toHaveLength(13);
//         body.articles.forEach((article) => {
//           expect(article.hasOwnProperty("article_id")).toBe(true);
//           expect(article.hasOwnProperty("author")).toBe(true);
//           expect(article.hasOwnProperty("title")).toBe(true);
//           expect(article.hasOwnProperty("topic")).toBe(true);
//           expect(article.hasOwnProperty("created_at")).toBe(true);
//           expect(article.hasOwnProperty("votes")).toBe(true);
//           expect(article.hasOwnProperty("article_img_url")).toBe(true);
//           expect(article.hasOwnProperty("comment_count")).toBe(true);
//         });
//       });
//   });
//   test("objects DO NOT have a body propertry", () => {
//     return request(app)
//       .get("/api/articles")
//       .then(({ body }) => {
//         body.articles.forEach((article) => {
//           expect(article.hasOwnProperty("body")).toBe(false);
//         });
//       });
//   });
//   test("returns objects sorted by DATE in DESC order", () => {
//     return request(app)
//       .get("api/articles")
//       .then(({ body }) => {
//         expect(body.articles).toBeSortedBy("created_at", { descending: true });
//       });
//   });
// });

describe("GET/api errors", () => {
  test("404 not found on path", () => {
    return request(app)
      .get("/apple")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("invalid file path");
      });
  });
  test("404 not found on extension", () => {
    return request(app)
      .get("/api/something")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("invalid file path");
      });
  });
  test("400 bad request on datatype", () => {
    return request(app)
      .get("/api/articles/wordNotNumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("404 not found on unused id number", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
});
