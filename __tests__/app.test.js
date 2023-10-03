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
  test("returns 200 status code", () => {
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
  test("returns 200 status code", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointInfo);
      })
      .catch();
  });
});

describe("GET/api/articles/:article_id", () => {
  test("200 and correct article with all properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.hasOwnProperty("author")).toBe(true);
        expect(body.article.hasOwnProperty("title")).toBe(true);
        expect(body.article.hasOwnProperty("article_id")).toBe(true);
        expect(body.article.hasOwnProperty("body")).toBe(true);
        expect(body.article.hasOwnProperty("topic")).toBe(true);
        expect(body.article.hasOwnProperty("created_at")).toBe(true);
        expect(body.article.hasOwnProperty("votes")).toBe(true);
      })
      .catch();
  });
});

describe("GET/api errors", () => {
  test("404 not found", () => {
    return request(app).get("/api/something").expect(404);
  });
  // test("400 bad request", () => {
  //   return request(app).get("/api/articles/wordNotNumber").expect(404);
  // });
});
