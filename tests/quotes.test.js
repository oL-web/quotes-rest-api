const request = require("supertest");
const mongoose = require("mongoose");
const server = require("../server");

const QUOTES_PATH = "/api/quotes";
const USERS_PATH = "/api/users";

describe("quotes", () => {
  let token = "";
  const postQuote = async () => {
    const response = await request(server)
      .post(QUOTES_PATH)
      .set("Authorization", "Bearer " + token)
      .send({ content: "content", author: "author" });

    return response;
  };

  beforeAll(async () => {
    const credentials = { name: "test", email: "test@example.com", password: "test" };

    await request(server)
      .post(USERS_PATH)
      .send(credentials);

    const acc = await request(server)
      .post(USERS_PATH + "/login")
      .send(credentials);

    token = acc.body.token;
  });

  afterAll(async () => {
    try {
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
      server.close();
    } catch (e) {
      console.log(e);
    }
  });

  test("GET all quotes", async () => {
    expect.assertions(2);
    const response = await request(server).get(QUOTES_PATH);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject([]);
  });

  test("POST a quote", async () => {
    expect.assertions(2);
    const response = await postQuote();

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
  });

  test("GET single quote", async () => {
    expect.assertions(3);
    const quote = await postQuote();
    const response = await request(server).get(QUOTES_PATH + "/" + quote.body.id);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("content");
  });

  test("DELETE a quote", async () => {
    expect.assertions(2);
    const quote = await postQuote();
    const response = await request(server)
      .delete(QUOTES_PATH + "/" + quote.body.id)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);

    const deletedQuote = await request(server).get(QUOTES_PATH + "/" + quote.body.id);
    expect(deletedQuote.status).toEqual(404);
  });

  test("PATCH a quote", async () => {
    expect.assertions(2);
    const quote = await postQuote();
    const response = await request(server)
      .patch(QUOTES_PATH + "/" + quote.body.id)
      .send({ author: "patched author" })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);

    const patchedQuote = await request(server).get(QUOTES_PATH + "/" + quote.body.id);
    expect(patchedQuote.body.author).toEqual("patched author");
  });
});
