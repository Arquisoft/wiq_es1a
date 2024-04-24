const { MongoMemoryServer } = require('mongodb-memory-server');


let mongoserver;
let userservice;
let authservice;
let gatewayservice;
let statsservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    userservice = await require("../../users/userservice/user-service");
    statsservice = await require("../../statsservice/stats-service");
    authservice = await require("../../users/authservice/auth-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
  }

  startServer();
