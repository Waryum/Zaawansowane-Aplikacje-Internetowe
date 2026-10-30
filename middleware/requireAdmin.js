// middleware for reading header of requests and checking if it has a proper token

// specific error changing via HttpError
const HttpError = require("../utils/errors");
// token functions
const { generateToken, hashToken } = require("../utils/tokens");
const pool = require("../db/connection");

async function requireAdmin(req, res, next){
    const header = req.get('Authorization');

    // if missing or malformed header throw HttpError(401, ...)
    if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
        throw new HttpError(401, 'Missing or malformed Authorization header');
    }

    // get token out of authorization header
    const token = header.slice('Bearer '.length);

    // calculate token hash
    const tokenHash = hashToken(token);
    // check token hash in database, is it valid, is there a logged admin
    const rows = await pool.query("SELECT adminId FROM tokens WHERE tokenHash = ? AND expiresAt > UTC_TIMESTAMP()", [tokenHash]);

    // check if admin was found
    const admin = rows[0];
    if (!admin) {
        throw new HttpError(401, 'Not a valid token');
    }


    // token correct admin found







}

module.exports = requireAdmin;