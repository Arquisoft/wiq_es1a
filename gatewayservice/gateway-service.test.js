const request = require("supertest");
const axios = require("axios");
const app = require("./gateway-service");

afterAll(async () => {
  app.close();
});

jest.mock("axios");

const TEST_PASSWORD = "testpassword";

describe("Gateway Service", () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith("/login")) {
      return Promise.resolve({ data: { token: "mockedToken" } });
    } else if (url.endsWith("/adduser")) {
      return Promise.resolve({ data: { userId: "mockedUserId" } });
    } else if (url.endsWith("/saveGame")) {
      return Promise.resolve({ data: { saved: true } });
    } else if (url.endsWith("/questions")) {
      return Promise.resolve({
        data: [
          {
            pregunta: "¿Cuál es la capital de Finlandia?",
            respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
            correcta: "Helsinki",
          },
        ],
      });
    } else if (url.endsWith("/saveGameList")) {
      return Promise.resolve({
        data: {
          userId: "testuser",
          games: [
            { gameMode: "classic", score: 100, date: "2024-04-02" },
            { gameMode: "time-trial", score: 150, date: "2024-04-03" },
          ],
        },
      });
    } else if (url.endsWith("/group/add")) {
      return Promise.resolve({ data: { success: true } });
    } else if (url.endsWith("/group/join")) {
      return Promise.resolve({ data: { success: true } });
    } else if (url.endsWith("/group/list")) {
      return Promise.resolve({ data: { groups: ["group1", "group2"] } });
    } 
  });

  axios.get.mockImplementation((url, data) => {
    if (url.endsWith("/questions")) {
      return Promise.resolve({
        data: [
          {
            pregunta: "¿Cuál es la capital de Finlandia?",
            respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
            correcta: "Helsinki",
          },
        ],
      });
    } else if (url.endsWith("/questions?n=1&tematica=all")) {
      return Promise.resolve({
        data: [
          {
            pregunta: "¿Cuál es la capital de Finlandia?",
            respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
            correcta: "Helsinki",
          },
        ],
      });
    } else if (url.endsWith("/stats")) {
      return Promise.resolve({ data: { stats: "mockedStats" } });
    } else if (url.endsWith("/userInfo/testuser")) {
      return Promise.resolve({ data: { userInfo: "mockedUserInfo" } });
    } else if (url.endsWith("/ranking")) {
      return Promise.resolve({ data: { ranking: "mockedRanking" } });
    } else if (url.endsWith("/health")) {
      return Promise.resolve({ data: { status: "OK" } });
    } else if (url.endsWith("/group/group1")) {
      return Promise.resolve({ data: { members: ["user1", "user2"] } });
    }
  });

  // Test /health endpoint
  it("should forward OK", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "OK" });
  });

  // Test /questions endpoint
  it("should return questions", async () => {
    // Realiza la solicitud GET a la ruta /questions
    const response = await request(app).post("/questions");

    // Verifica que la respuesta sea la esperada
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        pregunta: "¿Cuál es la capital de Finlandia?",
        respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
        correcta: "Helsinki",
      },
      // Agrega más preguntas esperadas si es necesario
    ]);
  });

  // Test /saveGameList endpoint
  it("should forward save game list request to user service", async () => {
    // Define los datos de la lista de juegos a enviar
    const gameListData = {
      userId: "testuser",
      games: [
        { gameMode: "classic", score: 100, date: "2024-04-02" },
        { gameMode: "time-trial", score: 150, date: "2024-04-03" },
      ],
    };

    // Realiza la solicitud POST a la ruta /saveGameList
    const response = await request(app)
      .post("/saveGameList")
      .send(gameListData);

    // Verifica que la respuesta sea la esperada
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(gameListData);
  });

  // Test /login endpoint
  it("should forward login request to auth service", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "testuser", password: TEST_PASSWORD });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe("mockedToken");
  });

  // Test /adduser endpoint
  it("should forward add user request to user service", async () => {
    const response = await request(app)
      .post("/adduser")
      .send({ username: "newuser", password: TEST_PASSWORD });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe("mockedUserId");
  });

  // Prueba de la ruta /questions
  it("should return a question", async () => {
    const response = await request(app).get("/questions");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        pregunta: "¿Cuál es la capital de Finlandia?",
        respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
        correcta: "Helsinki",
      },
    ]);
  });

  // Prueba de la ruta /questions?n=1&tematica=all
  it("should return a question", async () => {
    const response = await request(app).get("/questions?n=1&tematica=all");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        pregunta: "¿Cuál es la capital de Finlandia?",
        respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
        correcta: "Helsinki",
      },
    ]);
  });

  // Test /userInfo endpoint
  it("should forward userInfo request to user service", async () => {
    const response = await request(app)
      .get("/userInfo/testuser");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userInfo: "mockedUserInfo" });
  });

  // Test /stats endpoint
  it("should forward stats request to stats service", async () => {
    const response = await request(app)
      .get("/stats")
      .query({ user: "testuser", gamemode: "classic" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ stats: "mockedStats" });
  });

  // Test /ranking endpoint
  it("should forward ranking request to stats service", async () => {
    const response = await request(app)
      .get("/ranking")
      .query({ gamemode: "classic", filterBy: "all" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ranking: "mockedRanking" });
  });

  // Test /saveGame endpoint
  it("should forward save game request to stats service", async () => {
    const gameData = {
      userId: "testuser",
      gameMode: "classic",
      score: 100,
      date: "2024-04-02",
    };

    const response = await request(app).post("/saveGame").send(gameData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ saved: true });
  });

  // Prueba para la ruta /friends
  it("should forward friends request to user service", async () => {
    axios.get.mockResolvedValueOnce({ data: { friends: ["friend1", "friend2"] } });

    const response = await request(app).get("/friends").query({ userId: "testuser" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ friends: ["friend1", "friend2"] });
  });

  // Prueba para la ruta /users/search
  it("should forward search users request to user service", async () => {
    axios.get.mockResolvedValueOnce({ data: { users: ["user1", "user2"] } });

    const response = await request(app).get("/users/search").query({ query: "test" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ users: ["user1", "user2"] });
  });

  // Prueba para la ruta /users/add-friend
  it("should forward add friend request to user service", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const response = await request(app).post("/users/add-friend").send({ userId: "user1", friendId: "user2" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  // Prueba para la ruta /users/remove-friend
  it("should forward remove friend request to user service", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const response = await request(app).post("/users/remove-friend").send({ userId: "user1", friendId: "user2" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  // Prueba para la ruta /group/add
  it("should forward add group request to user service", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const response = await request(app).post("/group/add").send({ userId: "user1", groupName: "group1" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  // Prueba para la ruta /group/join
  it("should forward join group request to user service", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const response = await request(app).post("/group/join").send({ userId: "user1", groupName: "group1" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  // Prueba para la ruta /group/list
  it("should forward list groups request to user service", async () => {
    axios.get.mockResolvedValueOnce({ data: { groups: ["group1", "group2"] } });

    const response = await request(app).get("/group/list");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ groups: ["group1", "group2"] });
  });

  // Prueba para la ruta /group/:groupName
  it("should forward group info request to user service", async () => {
    const response = await request(app).get("/group/group1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ members: ["user1", "user2"] });
  });

});
