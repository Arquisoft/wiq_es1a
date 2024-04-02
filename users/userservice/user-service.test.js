const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should return user info on GET /userInfo', async () => {

    // Realizar la solicitud GET /userInfo
    const response = await request(app).get('/userInfo').query({ user: 'testuser' });

    // Verificar la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should save game data for the user on POST /saveGameList', async () => {

    // Datos de la partida a guardar
    const gameData = {
      username: 'testuser',
      gameMode: 'classic',
      gameData: { points: 100, correctAnswers: 8, incorrectAnswers: 2, avgTime: 30 }
    };

    // Realizar la solicitud POST /saveGameList
    const response = await request(app).post('/saveGameList').send(gameData);

    // Verificar la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Partida guardada exitosamente' });
  });
});
