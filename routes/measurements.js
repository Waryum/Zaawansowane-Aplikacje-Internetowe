// measurements tag activities
// express module
const express = require('express');
// db connection module
const pool = require("../db/connection");
// all sensors activities requireAdmin token
const requireSensor = require("../middleware/requireSensor"); // middleware for checking sensors API keys
// HttpError handler
const HttpError = require("../utils/errors");
// tokens creation and hashing
const { generateToken, hashToken } = require("../utils/tokens");

// module for route creation
const router = express.Router();





module.exports = router;