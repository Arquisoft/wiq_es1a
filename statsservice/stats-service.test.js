const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const statsResponse = require("./statsResponseExample.json");

let mongoServer;
let app;
let Stats;

const username = "testusername";
const responseExample = {
  username: username,
  gamemode: "exampleGamemode",
  nGamesPlayed: 10,
  avgPoints: 75.5,
  totalPoints: 755,
  totalCorrectQuestions: 150,
  totalIncorrectQuestions: 50,
  ratioCorrect: 0.75,
  avgTime: 45
}

const responseExample2 = {
  "username": "admin",
  "gamemode": "clasico",
  "gameData": {
      "correctAnswers": 1,
      "incorrectAnswers": 1,
      "points": 1,
      "avgTime": 2
    }
}

async function addStat(responseExample) {
  const newStat = new Stats(responseExample);

  await newStat.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_STATS_URI = mongoUri;
  app = require("./stats-service");
  Stats = require("./model/stats-model");
  await addStat(responseExample);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe("Stats Service", () => {
  it("should save game data successfully", async () => {
    jest.setTimeout(10000000); // Set maximum timeout to 10 seconds
    const response = await request(app).post("/saveGame").send(responseExample2);
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("username", username);
    expect(response.body).toHaveProperty("gamemode", "exampleGamemode");
    expect(response.body).toHaveProperty("nGamesPlayed", 11);
    expect(response.body).toHaveProperty("avgPoints", 82.27272727272727);
    expect(response.body).toHaveProperty("totalPoints", 905);
    expect(response.body).toHaveProperty("totalCorrectQuestions", 170);
    expect(response.body).toHaveProperty("totalIncorrectQuestions", 60);
    expect(response.body).toHaveProperty("ratioCorrect", 0.7391304347826086);
    expect(response.body).toHaveProperty("avgTime", 47.72727272727273);
  }, 10000000);

  it("should return user statistics successfully", async () => {
    const response = await request(app).get(
      `/stats/?username=${username}&gamemode=exampleGamemode`
    );
    expect(response.status).toBe(200);
    
    expect(response.body).toHaveProperty("nGamesPlayed", 10)
    expect(response.body).toHaveProperty("avgPoints", 75.5)
    expect(response.body).toHaveProperty("totalPoints", 755)
    expect(response.body).toHaveProperty("totalCorrectQuestions", 150)
    expect(response.body).toHaveProperty("totalIncorrectQuestions", 50)
    expect(response.body).toHaveProperty("ratioCorrect", 0.75)
    expect(response.body).toHaveProperty("avgTime", 45);
  });

  it("should return ranking successfully", async () => {
    const response = await request(app).get(
      `/ranking/?gamemode=exampleGamemode&filterBy=avgPoints`
    );
    expect(response.status).toBe(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("username", username);
    expect(response.body[0]).toHaveProperty("avgPoints", 75.5);
  });

  it("ranking should return error", async () => {
    const response = await request(app).get(
      `/ranking/?gamemode=exampleGamemodx&filterBy=avgPoints`
    );
    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty("error", "Error al obtener el ranking: No se encontraron estadísticas");
  });

  it("should return status 400 for incomplete game data", async () => {
    const response = await request(app).get(
      `/stats/?username=${username}`
    );
    expect(response.status).toBe(400);
  });
});
