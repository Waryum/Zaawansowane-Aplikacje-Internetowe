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
const http = require("node:http");

// module for route creation
const router = express.Router();

// function for changing database names into expected response values in json
function toMeasurementsResponse(row){
    return{
        id: row.id,
        seriesId: row.seriesId,
        sensorId: row.sensorId,
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
    if (body.timestamp === undefined){
        body.timestamp = new Date();
    }
    else if (typeof body.timestamp === "string"){
        body.timestamp = new Date(body.timestamp);
    }
    else {
        throw new HttpError(400, "Invalid timestamp");
    }
    // check if the date isn't from the future
    if (body.timestamp.getTime() > Date.now() + 5 * 60 * 1000){
        throw new HttpError(422, "Invalid date");
    }
    // check if given value is from the correct value range
    const seriesRange = await pool.query("SELECT lowestValue, highestValue FROM series WHERE id = ?", [req.sensor.seriesId]);
    if (body.value < seriesRange[0].lowestValue || body.value > seriesRange[0].highestRange){
        throw new HttpError(422, "Value from outside specified series range");
    }
    // save received measurement
    const result = await pool.query("INSERT INTO measurements (seriesId, sensorId, value, timestamp) VALUES (?, ?, ?, ?)", [body.seriesId, body.sensorId, body.value, Date()]);
    // read saved measurement
    const savedMeasurement = await pool.query("SELECT id, seriesId, sensorId, value, timestamp FROM measurements WHERE id = ?", [body.seriesId]);
    // response
    res.status(201)
        .location(`${req.baseUrl}/${savedMeasurement.insertId}`)
        .json({...toMeasurementsResponse(result[0])});

})



module.exports = router;