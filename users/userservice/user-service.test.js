const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = require('./user-service');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Service', () => {
  afterEach(async () => {
    // Limpiar la base de datos después de cada prueba
    await User.deleteMany({});
  });

  it('should return user info on GET /userInfo', async () => {
    // Agregar un usuario a la base de datos para probar
    const newUser = new User({
      username: 'testuser',
      password: 'testpassword',
    });
    await newUser.save();

    // Realizar la solicitud GET /userInfo
    const response = await request(app).get('/userInfo').query({ user: 'testuser' });

    // Verificar la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should save game data for the user on POST /saveGameList', async () => {
    // Agregar un usuario a la base de datos para probar
    const newUser = new User({
      username: 'testuser',
      password: 'testpassword',
    });
    await newUser.save();

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

    // Verificar que los datos del juego se hayan guardado en el usuario
    const updatedUser = await User.findOne({ username: 'testuser' });
    expect(updatedUser.games).toHaveLength(1);
    expect(updatedUser.games[0]).toHaveProperty('gameMode', 'classic');
  });
});

