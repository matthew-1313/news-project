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
        expect(body.article).toMatchObject({
          article_id: 2,
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String),
        });
      })
      .catch();
  });
});

describe("GET/api/articles", () => {
  test("200 status code", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("responds with array of correct article objects", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("objects DO NOT have a body propertry", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("returns objects sorted by DATE in DESC order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  test("200 status code", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("returns array of correct comments for given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("returns objects sorted by CREATED_AT in ASC order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { ascending: true });
      });
  });
});

describe("GET errors", () => {
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
  test("404 on wrong article id for comments", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
  test("400 bad request on datatype for comments", () => {
    return request(app)
      .get("/api/articles/wordNotNumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("200 for article id that has no comments attached", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.message).toBe("no comments on this article");
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("200 status code", () => {
    const newComment = {
      username: "rogersop",
      body: "this is my comment",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(200);
  });
  test("returns posted comment as object", () => {
    const newComment = {
      username: "rogersop",
      body: "this is my comment",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .then(({ body }) => {
        expect(body.newComment).toMatchObject({
          article_id: 10,
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "rogersop",
          body: expect.any(String),
        });
      });
  });
});

describe("POST errors", () => {
  test("400 bad request on datatype", () => {
    const newComment = {
      username: "rogersop",
      body: "this is my comment",
    };
    return request(app)
      .post("/api/articles/wordNotNumber/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("404 not found on unused id number", () => {
    const newComment = {
      username: "rogersop",
      body: "this is my comment",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
  test("404 not found on wrong user", () => {
    const newComment = {
      username: "harrystylesmum",
      body: "this is my comment",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("user not found");
      });
  });
  test("400 not found on missing key", () => {
    const newComment = {
      username: "harrystylesmum",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("missing object key");
      });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  test("200 status code with INCREASE votes", () => {
    const newReq = { inc_votes: 10 };
    return request(app).patch("/api/articles/10").send(newReq).expect(200);
  });
  test("returns correct article with INCREASED votes", () => {
    const newReq = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/10")
      .send(newReq)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(10);
      });
  });
  test("200 status code with DECREASE votes", () => {
    const newReq = { inc_votes: -11 };
    return request(app).patch("/api/articles/1").send(newReq).expect(200);
  });
  test("returns correct article with DECRESED votes", () => {
    const newReq = { inc_votes: -11 };
    return request(app)
      .patch("/api/articles/1")
      .send(newReq)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(89);
      });
  });
  test("200 status code with ZERO votes", () => {
    const newReq = { inc_votes: 0 };
    return request(app).patch("/api/articles/1").send(newReq).expect(200);
  });
  test("returns correct article with UNCHANGED votes", () => {
    const newReq = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/10")
      .send(newReq)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(0);
      });
  });
});

describe("PATCH errors", () => {
  test("400 bad request on datatype", () => {
    const newReq = { inc_votes: -11 };
    return request(app)
      .patch("/api/articles/wordNotNumber")
      .send(newReq)
      .expect(400);
  });
  test("404 not found on unused id", () => {
    const newReq = { inc_votes: -11 };
    return request(app).patch("/api/articles/99999").send(newReq).expect(404);
  });
  test("400 bad request on incorrect object", () => {
    const newReq = { amIHappy: false };
    return request(app).patch("/api/articles/1").send(newReq).expect(400);
  });
});

describe("DELETE/api/comments/:comment_id", () => {
  test("204 no content", () => {
    return request(app).delete("/api/comments/10").expect(204);
  });
});

describe("DELETE errors", () => {
  test("400 bad request on datatype", () => {
    return request(app)
      .delete("/api/comments/wordNotNumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("404 not found on unused comment id", () => {
    return request(app)
      .delete("/api/comments/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("comment not found");
      });
  });
});
