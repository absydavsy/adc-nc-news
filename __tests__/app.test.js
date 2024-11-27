const endpointsJson = require("../endpoints.json");
const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")

beforeEach(() => seed(data))
afterAll(() => db.end())

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
      expect(topics).toHaveLength(3)
      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String), 
          description: expect.any(String)
        })
      })
    })
  })
  test("404: sends an appropriate status and error message when attempting to access a non-existent endpoint", () => {
    return request(app)
      .get("/api/puppies")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('does not exist')
      })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object by its ID; object contains all relevant properties", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
      .then(({ body }) => {
          const expectedOutput = {
          article: [ {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          } ] }
        expect(body).toEqual(expectedOutput)
      })
      })
    test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
      .get("/api/articles/10193490")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('does not exist')
      })
    })
    test("400: sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/puppies")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request');
        });
    });
})

describe("GET /api/articles", () => {
  test("200: sends an articles array of article objects", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles).toHaveLength(13)
      expect(articles).toBeSortedBy("created_at", {
        descending: true, 
        coerce: true, 
      })
      articles.forEach((article) => {
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String), 
          title: expect.any(String), 
          article_id: expect.any(Number), 
          topic: expect.any(String), 
          created_at: expect.any(String), 
          votes: expect.any(Number), 
          article_img_url: expect.any(String), 
          comment_count: expect.any(Number)
        })
      })
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: sends an array of comments for the given article_id", () => {
      return request(app)
      .get("/api/articles/3/comments")
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", {
          descending: true, 
          coerce: true
        })
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number), 
            votes: expect.any(Number), 
            created_at: expect.any(String), 
            author: expect.any(String), 
            body: expect.any(String), 
            article_id: expect.any(Number)
          })
        })
  })
})
  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
    .get("/api/articles/10193490/comments")
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe('does not exist')
    })
})
  test("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
    .get("/api/articles/puppies/comments")
    .expect(400)
    .then(({ body }) => {
        expect(body.msg).toBe('bad request');
    });
});
})
  


