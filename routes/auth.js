// authorization tag activities
// required functions
const express = require('express');
const pool = require("../db/connection");
const HttpError = require("../utils/errors");
const { verifyPassword } = require("../utils/password");
const { generateToken, hashToken } = require("../utils/tokens");

// module for route creation
const router = express.Router();
const TOKEN_TTL_SECONDS = 3600; // Token time to live

//
router.post('/login', async (req, res) => {
    // read username and password from req.body

    // if missing throw HttpError(400, ...)

    // pool.query --> SELECT id, passwordHash FROM admins WHERE username = ?
    // verifyPassword

    // errors if no row or verifyPassword failed

    // generate token, save to db tokens: adminId, hashTokens(token),
    // expiresAt = UTC_TIMESTAMP() + INTERVAL ?, SECOND TOKEN_TTL_SECONDS

    // res.status(200).json({accessToken, tokenType, expiresIn})
});

module.exports = router;