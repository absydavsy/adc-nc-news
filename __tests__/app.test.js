const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each with properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: sends an appropriate status and error message when attempting to access a non-existent endpoint", () => {
    return request(app)
      .get("/api/puppies")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("does not exist");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test.skip("200: Responds with an article object by its ID; object contains all relevant properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const expectedOutput = {
          article: [
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          ],
        };
        expect(body).toEqual(expectedOutput);
      });
  });
  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/10193490")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("does not exist");
      });
  });
  test("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/puppies")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: sends an articles array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: sends an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/10193490/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("does not exist");
      });
  });
  test("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/puppies/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of user objects, each with properties of username, name, and avatar_url ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  // test("200: responds with an empty array when there are no users", () => {
  //   return request(app)
  //   .get("/api/users")
  //   .expect(200)
  //   .then(({ body: { users } }) => {
  //     expect(users).toHaveLength(0)
  //   })
  // })

  test("404: sends an appropriate status and error message when attempting to access a non-existent endpoint", () => {
    return request(app)
      .get("/api/puppies")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("does not exist");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a newly posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "world is topsy turvy",
      article_id: 6,
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "world is topsy turvy",
          comment_id: expect.any(Number),
          author: "lurker",
          article_id: 6,
          votes: expect.any(Number),
        });
      });
  });
  test("400: responds with an appropriate status and error message when provided with an invalid article_id", () => {
    const newComment = {
      username: "lurker",
      body: "world is topsy turvy",
      article_id: "puppies",
    };
    return request(app)
      .post("/api/articles/puppies/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with newly updated article", () => {
    const newVotes = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toBe(107);
      });
  });
  test("400: responds with appropriate status and error message when provided an invalid 'inc_votes", () => {
    const newVotes = { inc_votes: "puppies" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate status and error message when provided with an invalid article_id", () => {
    const newVotes = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/puppies")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate status and error message when provided with a valid article_id that does not exist", () => {
    const newVotes = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/101911")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with 204 and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: responds with an appropriate status and error message when given a non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/10519")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("does not exist");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/puppies")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
