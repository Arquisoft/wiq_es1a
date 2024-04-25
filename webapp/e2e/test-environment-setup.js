const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { User } = require('./user-model');
const bcrypt = require('bcrypt');

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

    await mongoose.connect(mongoUri);
    const existingUser = await User.findOne({ username: "testuser" });
    if (!existingUser) {
      const pass = await bcrypt.hash("Testpassword1", 10);
      const newUser = new User({
              username: "testuser",
              password: pass,
      });
      await newUser.save();
    }
  }

  startServer();
