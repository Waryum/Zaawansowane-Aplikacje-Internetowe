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
    const body = req.body ?? {}; // prepared for req with no body, if no body substitute with {}.
    const username = body.username;
    const password = body.password;

    // if missing throw HttpError(400, ...)
    if (typeof username !== 'string' || username.length === 0) {
        throw new HttpError(400, 'Field "username" is required');
    }
    if (typeof password !== 'string' || password.length === 0) {
        throw new HttpError(400, 'Field "password" is required');
    }

    // pool.query --> SELECT id, passwordHash FROM admins WHERE username = ?
    const rows = await pool.query('SELECT id, passwordHash FROM admins WHERE username = ?', [username]);
    const admin = rows[0];

    // checking if admin is not an empty row (i.e. wrong username)
    if (!admin) {
        throw new HttpError(401, 'Invalid username or password');
    }

    // verify Password
    const checkPasswordBool = await verifyPassword(admin.passwordHash, password);
    // errors if verifyPassword failed
    if (!checkPasswordBool) {
        throw new HttpError(401, "Invalid username or password");
    }

    // generate token, save to db tokens: adminId, hashTokens(token),
    // expiresAt = UTC_TIMESTAMP() + INTERVAL ?, SECOND TOKEN_TTL_SECONDS

    const token = generateToken();
    await pool.query('INSERT INTO tokens (adminId, tokenHash, expiresAt) VALUES (admin.id, hashToken(token), UTC_TIMESTAMP() + INTERVAL ? SECONDS)', TOKEN_TTL_SECONDS);

    // res.status(200).json({accessToken, tokenType, expiresIn})
    res.status(200).json({
        accessToken: token,
        tokenType: token,
        expiresIn: TOKEN_TTL_SECONDS
    });
});

module.exports = router;