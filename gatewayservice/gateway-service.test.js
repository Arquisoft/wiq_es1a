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
});