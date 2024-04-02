const request = require("supertest");
const axios = require("axios");
const app = require("./gateway-service");

afterAll(async () => {
  app.close();
});

jest.mock("axios");

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
    } else if (url.endsWith("/userInfo")) {
      return Promise.resolve({ data: { userInfo: "mockedUserInfo" } });
    } else if (url.endsWith("/ranking")) {
      return Promise.resolve({ data: { ranking: "mockedRanking" } });
    } else if (url.endsWith("/health")) {
      return Promise.resolve({ data: { status: "OK" } });
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
      .send({ username: "testuser", password: "testpassword" });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe("mockedToken");
  });

  // Test /adduser endpoint
  it("should forward add user request to user service", async () => {
    const response = await request(app)
      .post("/adduser")
      .send({ username: "newuser", password: "newpassword" });

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
      .get("/userInfo")
      .query({ user: "testuser" });

    expect(response.statusCode).toBe(200);
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
});
