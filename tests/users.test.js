const request = require("supertest");
const mongoose = require("mongoose");
const nanoid = require("nanoid");
const server = require("../server");

const USERS_PATH = "/api/users";

describe("users", () => {
  const generateCredentials = () => ({ name: nanoid(), email: nanoid() + "@example.com", password: "test" });
  const makeAccount = async () => {
    const credentials = generateCredentials();
    const user = await request(server)
      .post(USERS_PATH)
      .send(credentials);
    const acc = await request(server)
      .post(USERS_PATH + "/login")
      .send(credentials);

    return {
      token: acc.body.token,
      id: user.body.id
    };
  };

  afterAll(async () => {
    try {
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
      server.close();
    } catch (e) {
      console.log(e);
    }
  });

  test("GET all users", async () => {
    expect.assertions(2);
    const response = await request(server).get(USERS_PATH);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject([]);
  });

  test("POST a user", async () => {
    expect.assertions(2);
    const user = await request(server)
      .post(USERS_PATH)
      .send(generateCredentials());

    expect(user.status).toEqual(201);
    expect(typeof user.body.id).toEqual("string");
  });

  test("Login user", async () => {
    expect.assertions(2);
    const user = await makeAccount();
    expect(typeof user.id).toBe("string");
    expect(typeof user.token).toBe("string");
  });

  test("GET single user", async () => {
    expect.assertions(3);
    const user = await makeAccount();
    const response = await request(server).get(USERS_PATH + "/" + user.id);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  });

  test("DELETE a user himself", async () => {
    expect.assertions(2);
    const user = await makeAccount();
    const response = await request(server)
      .delete(USERS_PATH + "/" + user.id)
      .set("Authorization", "Bearer " + user.token);

    expect(response.status).toBe(200);

    const deletedUser = await request(server).get(USERS_PATH + "/" + user.id);
    expect(deletedUser.status).toEqual(404);
  });

  test("not DELETE a different user", async () => {
    expect.assertions(1);
    const user1 = await makeAccount();
    const user2 = await makeAccount();
    const response = await request(server)
      .delete(USERS_PATH + "/" + user1.id)
      .set("Authorization", "Bearer " + user2.token);

    expect(response.status).toBe(401);
  });
});
