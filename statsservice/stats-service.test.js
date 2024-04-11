const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Stats = require("./model/stats-model");

let mongoServer;
let app;
let stats;

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

async function addStat(responseExample) {
  const newStat = new Stats(responseExample);

  await newStat.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_STATS_URI = mongoUri;
  app = require("./stats-service");
  stats = require("./model/stats-model");
  await addStat(responseExample);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe("Stats Service", () => {
  it("should save stats successfully", async () => {
    const response = await request(app).post("/saveGame").send(responseExample);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Game saved successfully",
    });
  });

  it("should return user statistics successfully", async () => {
    const response = await request(app).get(
      `/stats/?user=${username}&gamemode=exampleGamemode`
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responseExample);
  });

  it("should return status 400 for incomplete game data", async () => {
    const response = await request(app).get(
      `/stats/?user=${username}&gamemode=exampleGamemode`
    );
    expect(response.status).toBe(200);
  });
});
