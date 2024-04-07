const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { User } = require("./user-model");

let mongoServer;
let app;

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
      password: "testpassword",
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

  it("should add a new user on POST /adduser", async () => {
    const newUser = {
      username: "testuser",
      password: "testpassword",
    };

    await request(app).post("/adduser").send(newUser);
    const response = await request(app).post("/adduser").send(newUser);
    expect(response.status).toBe(400);
  });

  it("should return user info on GET /userInfo", async () => {
    // Realizar la solicitud GET /userInfo
    const response = await request(app)
      .get("/userInfo")
      .query({ user: "testuser" });

    // Verificar la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
  });

  it("should return error on GET /userInfo", async () => {
    // Realizar la solicitud GET /userInfo sin parámetros
    const response = await request(app).get("/userInfo");

    // Verificar la respuesta
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Input debe ser una cadena de texto",
    });
  });

  it("should save game data for the user on POST /saveGameList", async () => {
    // Datos de la partida a guardar
    const gameData = {
      username: "testuser",
      gameMode: "classic",
      gameData: {
        points: 100,
        correctAnswers: 8,
        incorrectAnswers: 2,
        avgTime: 30,
      },
    };

    // Realizar la solicitud POST /saveGameList
    const response = await request(app).post("/saveGameList").send(gameData);

    // Verificar la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Partida guardada exitosamente" });
  });

  it("should send error POST /saveGameList", async () => {
    // Datos de la partida a guardar
    const gameData = {
      username: "testuseraaa",
      gameMode: "classic",
      gameData: {
        points: 100,
        correctAnswers: 8,
        incorrectAnswers: 2,
        avgTime: 30,
      },
    };

    // Realizar la solicitud POST /saveGameList
    const response = await request(app).post("/saveGameList").send(gameData);

    // Verificar la respuesta
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Usuario no encontrado" });
  });

  it("should add friend on POST /users/add-friend", async () => {
    const friend = {
      username: "testuser",
      friend: "testfriend",
    };

    const response = await request(app).post("/users/add-friend").send(friend);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Friend added successfully"
    );
  });

  it("should remove friend on POST /users/remove-friend", async () => {
    const friend = {
      username: "testuser",
      friend: "testfriend",
    };

    const response = await request(app)
      .post("/users/remove-friend")
      .send(friend);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Friend removed successfully"
    );
  });

  it("should retrieve friends on GET /users/friends", async () => {
    const response = await request(app)
      .get("/friends")
      .query({ user: "testuser" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("friends");
  });

  it("should get all users on GET /users", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
