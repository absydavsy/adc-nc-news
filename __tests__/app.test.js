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
})

describe("GET error handling", () => {
  test("GET: 404 sends an appropriate status and error message when attempting to access a non-existent endpoint", () => {
    return request(app)
      .get("/api/puppies")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('not found')
      })
  })
})