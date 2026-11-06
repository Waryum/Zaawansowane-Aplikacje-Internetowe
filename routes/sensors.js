// sensors tag activities
// express module
const express = require('express');
// db connection module
const pool = require("../db/connection");
// all sensors activities requireAdmin token
const requireAdmin = require("../middleware/requireAdmin"); // middleware for checking Admin token
//HttpError handler
const HttpError = require("../utils/errors");

// module for route creation
const router = express.Router();







// exporting sensor.js module
module.exports = router;