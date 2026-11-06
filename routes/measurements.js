// measurements tag activities
// express module
const express = require('express');
// db connection module
const pool = require("../db/connection");
// all sensors activities requireSensor API key
const requireSensor = require("../middleware/requireSensor"); // middleware for checking sensors API keys
// HttpError handler
const HttpError = require("../utils/errors");

// module for route creation
const router = express.Router();

// function for changing database names into expected response values in json
function toMeasurementsResponse(row){
    return{
        id: row.id,
        seriesId: row.seriesId,
        sensorId: row.sensorId ?? undefined,
        value: row.value,
        timestamp: row.timestamp,
    };
}

// POST /api/measurements, requires sensor api key
router.post("/", requireSensor, async (req, res) => {
    // get request body
    const body = req.body ?? {};
    // check if received value is a number
    if (!Number.isFinite(body.value)){
        throw new HttpError(400, "Invalid value");
    }
    // check timestamp
    let timestamp;
    if (body.timestamp === undefined){
        timestamp = new Date();
    }
    else if (typeof body.timestamp === "string"){
        timestamp = new Date(body.timestamp);
    }
    else {
        throw new HttpError(400, "Invalid timestamp");
    }
    // check incorrect timestamp date
    if (Number.isNaN(timestamp.getTime())){
        throw new HttpError(400, 'Field "timestamp" must be a valid ISO 8601 date');
    }
    // check if the date isn't from the future
    if (timestamp.getTime() > Date.now() + 5 * 60 * 1000){
        throw new HttpError(422, "Invalid date: Timestamp is more than 5 minutes in the future");
    }
    // check if given value is from the correct value range
    const seriesRange = await pool.query("SELECT lowestValue, highestValue FROM series WHERE id = ?", [req.sensor.seriesId]);
    if (body.value < seriesRange[0].lowestValue || body.value > seriesRange[0].highestValue){
        console.error(`Rejected measurement from sensor ${req.sensor.id}: value ${body.value} outside [${seriesRange[0].lowestValue}, ${seriesRange[0].highestValue}]`);
        throw new HttpError(422, "Value from outside specified series range");
    }
    // save received measurement
    const result = await pool.query("INSERT INTO measurements (seriesId, sensorId, value, timestamp) VALUES (?, ?, ?, ?)", [req.sensor.seriesId, req.sensor.id, body.value, timestamp]);
    // read saved measurement
    const savedMeasurement = await pool.query("SELECT id, seriesId, sensorId, value, timestamp FROM measurements WHERE id = ?", [result.insertId]);
    // response
    res.status(201)
        .location(`${req.baseUrl}/${result.insertId}`)
        .json(toMeasurementsResponse(savedMeasurement[0]));
})

// GET /api/measurements/{id}
router.get('/:{measurementId}', async (req, res) => {
    // check database for specific measurementId received in Request
    const rows = await pool.query('SELECT id, seriesId, sensorId, value, timestamp FROM measurements WHERE id = ?', [req.params.measurementId]);
    const row = rows[0];
    if (row === undefined){
        throw new HttpError(404, `Specified measurement with id ${req.params.measurementId} not found.`);
    }
    // response if specified seriesId found
    res.json(toMeasurementsResponse(row));
})

// GET /api/measurements with filters
router.get('/', async (req, res) => {
    // tables for search parameters and conditions
    const conditions = [];
    const params = [];
    // check if seriesId is defined
    if (seriesIds !== undefined){
        conditions.push(`seriesId IN (${seriesIds.map(() => '?').join(', ')})`);
        params.push(...seriesIds);
    }
    if (from !== undefined){
        conditions.push('timestamp >= ?');
        params.push(from);
    }
    if (to !== undefined){
        conditions.push('timestamp <= ?');
        params.push(to);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT id, seriesId, sensorId, value, timestamp FROM measurements ${where} ` + `ORDER BY timestamp ${direction}, id ${direction} LIMIT ?`;
    params.push(limit);
})



module.exports = router;