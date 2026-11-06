// middleware for checking sensor apiKey
// specific error changing via HttpError
const HttpError = require("../utils/errors");
// token functions
const { hashToken } = require("../utils/tokens");
const pool = require("../db/connection");

async function requireSensor(req, res, next){
    // get apiKey from received request
    const apiKey = req.get('X-API-Key');
    // if missing or malformed apiKey throw HttpError(401, ...)
    if (typeof apiKey !== 'string' || apiKey.length <= 0) {
        throw new HttpError(401, 'Missing or malformed Api key');
    }
    // calculate apiKey hash
    const apiKeyHash = hashToken(apiKey);
    // check apiKeyHash in database, is it valid, is there a sensor with this apiKey
    const rows = await pool.query("SELECT id, seriesId FROM sensors WHERE apiKeyHash = ?", [apiKeyHash]);
    // check if row was found
    const row = rows[0];
    if (!row) {
        throw new HttpError(401, 'Not a valid sensor API Key');
    }
    // apiKey correct sensor found, forwards the request further with the correct sensor row
    req.sensor = row; // add found sensors row to request
    next(); // let it pass further

}

module.exports = requireSensor;