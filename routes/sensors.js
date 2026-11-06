// sensors tag activities
// express module
const express = require('express');
// db connection module
const pool = require("../db/connection");
// all sensors activities requireAdmin token
const requireAdmin = require("../middleware/requireAdmin"); // middleware for checking Admin token
// HttpError handler
const HttpError = require("../utils/errors");
// tokens creation and hashing
const { generateToken, hashToken } = require("../utils/tokens");

// module for route creation
const router = express.Router();

// all activities require Admin token
router.use(requireAdmin);

// function for changing database names into expected response values in json, never respond with saved apiHashKey in db
function toSensorsResponse(row){
    return{
        id: row.id,
        name: row.name,
        seriesId: row.seriesId,
        createdAt: row.createdAt,
        lastMeasurementAt: row.lastMeasurementAt,
    };
}

// POST /api/sensor
router.post("/", async (req, res) => {
    // get body from request
    const body = req.body ?? {};
    // name is required
    if (typeof body.name !== 'string' || body.name.length === 0 || body.name.length > 100){
        throw new HttpError(400, 'Field "name" must be a string of 1-100 characters');
    }
    // validate seriesId
    const seriesId = body.seriesId;
    if (!(Number.isInteger(seriesId) || (typeof seriesId === 'string' && seriesId.length > 0))) {
        throw new HttpError(400, 'Field "seriesId" must be an integer or a non-empty string');
    }
    // check if series exists in database table
    const seriesRows = await pool.query('SELECT id FROM series WHERE id = ?', [seriesId]);
    if (seriesRows[0] === undefined){
        throw new HttpError(422, `Specified series ${seriesId} not found.`);
    }
    // generate token
    const apiKey = generateToken();
    // insert into database received sensor with generated and hashed apiKey
    const insertSensor = await pool.query('INSERT INTO sensors (name, seriesId, apiKeyHash) VALUES (?, ?, ?)', [body.name, body.seriesId, hashToken(apiKey)]);
    // check inserted row SELECT
    const sensorRows = await pool.query('SELECT id, name, seriesId, createdAt, lastMeasurementAt FROM sensors WHERE id = ?', [insertSensor.insertId]);
    // response
    res.status(201)
        .location(`${req.baseUrl}/${insertSensor.insertId}`)
        .json({...toSensorsResponse(sensorRows[0]), apiKey });
})

// GET /api/sensors, requiresAdmin
router.get('/', async (req, res) => {
    // check database for a list of sensors
    const rows = await pool.query('SELECT id, name, createdAt, lastMeasurementAt FROM sensors ORDER BY id');
    //response in json
    res.json(rows.map(toSensorsResponse));
})

// GET /api/sensor/{sensorId}
router.get('/:sensorId', async (req, res) => {
    // check database for specific sensorId received in Request
    const rows = await pool.query('SELECT id, name, createdAt, lastMeasurementAt FROM sensors WHERE id = ?', [req.params.sensorId]);
    const row = rows[0];
    if (row === undefined){
        throw new HttpError(404, `Specified sensor with id ${req.params.sensorId} not found.`);
    }
    // response if specified sensorId found
    res.json(toSensorsResponse(row));
})

// DELETE /api/sensor/{sensorId}
router.delete('/:sensorId', async (req, res) => {
    // try to delete specified sensorId
    const result = await pool.query('DELETE FROM sensors WHERE id = ?', [req.params.sensorId]);
    // check if anything was deleted
    if (result.affectedRows === 0){
        throw new HttpError(404, `Specified sensor with id ${req.params.sensorId} not found.`);
    }
    // response after correct delete
    res.status(204).end();
})






// exporting sensor.js module
module.exports = router;