const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

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
  avgTime: 45,
};

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
  it("should return user statistics successfully", async () => {
    const response = await request(app).get(
      `/stats/?username=${username}&gamemode=exampleGamemode`
    );

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("nGamesPlayed", 10);
    expect(response.body).toHaveProperty("avgPoints", 75.5);
    expect(response.body).toHaveProperty("totalPoints", 755);
    expect(response.body).toHaveProperty("totalCorrectQuestions", 150);
    expect(response.body).toHaveProperty("totalIncorrectQuestions", 50);
    expect(response.body).toHaveProperty("ratioCorrect", 0.75);
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

    expect(response.body).toHaveProperty(
      "error",
      "Error getting ranking: No stats found"
    );
  });

  it("should return status 400 for incomplete game data", async () => {
    const response = await request(app).get(`/stats/?username=${username}`);
    expect(response.status).toBe(400);
  });

  it("should save game data successfully", async () => {
    const gameData = {
      username: "testusername",
      gameMode: "clasico",
      gameData: {
        points: 100,
        correctAnswers: 10,
        incorrectAnswers: 5,
        avgTime: 30,
      },
    };

    const response = await request(app)
      .post("/saveGame")
      .send(gameData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Game saved successfully"
    );
  });

  it("should return error when saving game data with invalid game mode", async () => {
    const gameData = {
      username: "testusername",
      gameMode: "invalid",
      gameData: {
        points: 100,
        correctAnswers: 10,
        incorrectAnswers: 5,
        avgTime: 30,
      },
    };

    const response = await request(app)
      .post("/saveGame")
      .send(gameData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Error while saving game: Invalid game mode"
    );
  });

  it("should return user not found error when fetching stats for non-existing user", async () => {
    const response = await request(app).get(
      "/stats/?username=nonexistinguser&gamemode=exampleGamemode"
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "User not found");
  });

  it("should return error when fetching stats with incomplete parameters", async () => {
    const response = await request(app).get("/stats/?username=testusername");

    expect(response.status).toBe(400);
  });

  
});
