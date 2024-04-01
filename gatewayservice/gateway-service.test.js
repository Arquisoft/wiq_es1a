const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    }
  });

  axios.get.mockImplementation((url, data) => {
    if (url.endsWith("/questions")) {
      return Promise.resolve({
        data: [
          {
            pregunta: "¿Cuál es la capital de Finlandia?",
            respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
            correcta: "Helsinki"
          }
        ],
      });
    } else if (url.endsWith("/questions?n=1&tematica=all")) {
      return Promise.resolve({
        data: [
          {
            pregunta: "¿Cuál es la capital de Finlandia?",
            respuestas: ["Ámsterdam", "Pretoria", "Lima", "Helsinki"],
            correcta: "Helsinki"
          }
        ],
      });
    } else if (url.endsWith('/stats')) {
      return Promise.resolve({ data: { stats: 'mockedStats' } });
    } else if (url.endsWith('/userInfo')) {
      return Promise.resolve({ data: { userInfo: 'mockedUserInfo' } });
    } else if (url.endsWith('/ranking')) {
      return Promise.resolve({ data: { ranking: 'mockedRanking' } });
    }
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
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
        correcta: "Helsinki"
      }
    ]);
  });

  // Test /userInfo endpoint
  it('should forward userInfo request to user service', async () => {
    const response = await request(app)
      .get('/userInfo')
      .query({ user: 'testuser' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ userInfo: 'mockedUserInfo' });
  });

  // Test /saveGameList endpoint
  it('should forward saveGameList request to user service', async () => {
    const response = await request(app)
      .post('/saveGameList')
      .send({ username: 'testuser', gameMode: 'classic', gameData: { points: 100, correctAnswers: 8, incorrectAnswers: 2, avgTime: 30 } });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Partida guardada exitosamente' });
  });

  // Test /stats endpoint
  it('should forward stats request to stats service', async () => {
    const response = await request(app).get("/stats").query({ user: 'testuser', gamemode: 'classic' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ stats: 'mockedStats' });
  });

  // Test /saveGame endpoint
  it('should forward saveGame request to stats service', async () => {
    const response = await request(app)
      .post('/saveGame')
      .send({ username: 'testuser', gameMode: 'classic', gameData: { points: 100, correctAnswers: 8, incorrectAnswers: 2, avgTime: 30 } });

    // Write your test assertions here
  });

  // Test /ranking endpoint
  it('should forward ranking request to stats service', async () => {
    const response = await request(app).get("/ranking").query({ gamemode: 'classic', filterBy: 'all' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ranking: 'mockedRanking' });
  });
});