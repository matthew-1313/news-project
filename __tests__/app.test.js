const db = require("../db/connection");
const app = require("../db/app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const format = require("pg-format");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET/api errors", () => {
  test("404 not found", () => {
    return request(app).get("/api/something").expect(404);
  });
});

describe("GET/api/topics", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("responds with array of correct topic objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        //console.log(body.topics);
        body.topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(typeof topic.slug).toBe("string");
          expect(topic.hasOwnProperty("description")).toBe(true);
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
