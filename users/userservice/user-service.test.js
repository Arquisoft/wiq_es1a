const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { User } = require("./user-model");

let mongoServer;
let app;

const username = "testuser";
const friendUsername = "testfriend";
const password = "Testpassword1";
const badPassword = "pass";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require("./user-service");
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe("User Service", () => {
  it("should add a new user on POST /adduser", async () => {
    const newUser = {
      username: "testuser",
      password: password,
    };

    const response = await request(app).post("/adduser").send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
  });

  it("should send error on POST /adduser", async () => {
    const newUser = {
      username: "testuser",
    };

    const response = await request(app).post("/adduser").send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required field: password",
    });
  });


  it("should send password validation error on POST /adduser", async () => {
    const newUser = {
      username: "testuser",
      password: badPassword,
    };

    const response = await request(app).post("/adduser").send(newUser);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Password must be at least 8 characters long, contain at least one uppercase letter, and at least one number.",
    });
  });

  it("should add a new user on POST /adduser", async () => {
    const newUser = {
      username: "testuser",
      password: password,
    };

    await request(app).post("/adduser").send(newUser);
    const response = await request(app).post("/adduser").send(newUser);
    expect(response.status).toBe(400);
  });

  it("should return user info on GET /userInfo", async () => {
    const response = await request(app)
      .get("/userInfo/testuser");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
  });

  it("should return error on GET /userInfo", async () => {
    const response = await request(app).get("/userInfo");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({    });
  });

  it("should save game data for the user on POST /saveGameList", async () => {
    const gameData = {
      username: "testuser",
      gameMode: "clasico",
      gameData: {
        points: 100,
        correctAnswers: 8,
        incorrectAnswers: 2,
        avgTime: 30,
      },
    };

    const response = await request(app).post("/saveGameList").send(gameData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Game saved successfully" });
  });

  it("should send error POST /saveGameList", async () => {
    const gameData = {
      username: "testuseraaa",
      gameMode: "clasico",
      gameData: {
        points: 100,
        correctAnswers: 8,
        incorrectAnswers: 2,
        avgTime: 30,
      },
    };

    const response = await request(app).post("/saveGameList").send(gameData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("should send error POST /saveGameList for invalid gamemode", async () => {
    const gameData = {
      username: "testuser",
      gameMode: "a",
      gameData: {
        points: 100,
        correctAnswers: 8,
        incorrectAnswers: 2,
        avgTime: 30,
      },
    };

    const response = await request(app).post("/saveGameList").send(gameData);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ error: "Invalid gamemode" });
  });

  it("should add friend on POST /users/add-friend", async () => {

    const friend = {
      username: "testuser",
      friendUsername: "testfriend",
    };

    await request(app).post("/adduser").send({username: friendUsername, password: password});

    let response = await request(app).post("/users/add-friend").send(friend);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Friend added successfully"
    );
  });

  it("should return error 400 on POST /users/add-friend", async () => {
    const friend = {
      username: "testuser1",
      friendUsername: "testfriend",
    };

    const response = await request(app).post("/users/add-friend").send(friend);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("should return error 404 on POST /users/add-friend", async () => {
    const friend = {
      username: "testuser",
      friend: "testfriend",
    };

    await request(app).post("/users/add-friend").send(friend);
    const response = await request(app).post("/users/add-friend").send(friend);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Friend already added" });
  });

  it("should remove friend on POST /users/remove-friend", async () => {
    const friend = {
      username: username,
      friendUsername: friendUsername,
    };

    let response = await request(app)
      .post("/users/remove-friend")
      .send(friend);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Friend removed successfully"
    );
  });

  it("should remove friend on POST /users/remove-friend", async () => {
    const friend = {
      username: "testuserx",
      friend: "testfriendx",
    };

    const response = await request(app)
      .post("/users/remove-friend")
      .send(friend);
    expect(response.status).toBe(404);
  });

  it("should retrieve friends on GET /users/friends", async () => {
    const response = await request(app)
      .get("/friends")
      .query({ user: "testuser" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("friends");
  });

  it("should return error on GET /users/friends", async () => {
    const response = await request(app)
      .get("/friends")
      .query({ user: "testuser1" });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("should get all users on GET /users", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("should search for users on GET /users/search", async () => {
    const response = await request(app)
      .get("/users/search")
      .query({ username: "testuser" });
    expect(response.status).toBe(200);
    expect(response.body).not.toEqual([]);
  });

  it("should search for users on GET /users/search and get not found", async () => {
    const response = await request(app)
      .get("/users/search")
      .query({ username: "asdasd" });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("should find a user by username", async () => {
    const username = "testuser";
    const user = await User.findOne({ username });
    expect(user).toBeDefined();
    expect(user.username).toBe(username);
  });

  it("should get game data for the user on GET /userGames", async () => {
    const response = await request(app)
      .get("/userGames")
      .query({ user: "testuser" });
    expect(response.status).toBe(200);
  });

  it("should add a group on POST /group/add", async () => {
    const group = {
      name: "testgroup",
      username: "testuser",
    };

    const response = await request(app).post("/group/add").send(group);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message","Group created successfully");
  });

  it("should return error on POST /group/add", async () => {
    const group = {
      name: "testgroup2",
    };

    const response = await request(app).post("/group/add").send(group);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missing required field: username" });
  });

  it("should return all available groups on GET /group/list", async () => {
    const response = await request(app).get("/group/list");
    expect(response.body.groups).toBeDefined();
    expect(response.body.groups).toHaveLength(1);
  });

  it("should return specified group on GET /group/:groupName", async () => {
    const response = await request(app).get("/group/testgroup");
    expect(response.status).toBe(200);
    expect(response.body.group).toBeDefined();
    expect(response.body.group.name).toBe("testgroup");
  });

  it("should join a group on POST /group/join", async () => {
    let response = await request(app).get("/group/testgroup");
    expect(response.status).toBe(200);
    expect(response.body.group._id).toBeDefined();
    const groupId = response.body.group._id;

    const group = {
      username: "testfriend",
      groupId: groupId,
    };

    response = await request(app).post("/group/join").send(group);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message","User joined the group successfully");
  });
});
