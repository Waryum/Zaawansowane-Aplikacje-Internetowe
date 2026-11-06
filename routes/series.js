// series tag activities

// authorization tag activities
// required functions
const express = require('express');
const pool = require("../db/connection");
// for POST requiring admin privileges
const requireAdmin = require("../middleware/requireAdmin"); // middleware for checking Admin token
//HttpError handler
const HttpError = require("../utils/errors");

// module for route creation
const router = express.Router();

// function for changing database names into expected response values in json
function toSeriesResponse(row){
    return{
        id: row.id,
        name: row.name,
        minValue: row.lowestValue,
        maxValue: row.highestValue,
        unit: row.unit,
        color: row.color,
        icon: row.icon,
    };
}

// function that validates posted series
function validateSeriesInput(body){
    // name is required
    if (typeof body.name !== 'string' || body.name.length === 0 || body.name.length > 100){
        throw new HttpError(400, 'Field "name" must be a string of 1-100 characters');
    }
    // minValue, maxValue: numbers required (typeof + Number.isFinite)
    if (!Number.isFinite(body.minValue)){
        throw new HttpError(400, 'Field "minValue" must be a finite number');
    }
    if (!Number.isFinite(body.maxValue)){
        throw new HttpError(400, 'Field "maxValue" must be a finite number');
    }
    // color: required, regex /^#[0-9A-Fa-f]{6}$/.test(...)
    if (typeof body.color !== 'string' || /^#[0-9A-Fa-f]{6}$/.test(body.color) === false){
        throw new HttpError(400, 'Field "color" must be in #RRGGBB format');
    }

    // unit: optional undefined, null or string up to 20
    if (body.unit !== undefined && body.unit !== null && (typeof body.unit !== 'string' || body.unit.length > 20)){
        throw new HttpError(400, 'Field "unit" must be a string of at most 20 characters or NULL');
    }
    // icon: optional undefined, null or string up to 50
    if (body.icon !== undefined && body.icon !== null && (typeof body.icon !== 'string' || body.icon.length > 50)){
        throw new HttpError(400, 'Field "icon" must be a string of at most 50 characters or NULL');
    }
    // check if minValue >= maxValue
    if (body.minValue >= body.maxValue){
        throw new HttpError(422, "Minimum value must be lesser than maximum value.");
    }
}

// GET /api/series request router
router.get('/', async (req, res) => {
    // check database for a list of series
    const rows = await pool.query('SELECT id, name, lowestValue, highestValue, unit, color, icon FROM series ORDER BY id');
    //response in json
    res.json(rows.map(toSeriesResponse));
});

// POST /api/series
// requires admin privileges
router.post('/', requireAdmin, async (req, res) => {
    const body = req.body ?? {};
    // check received body values
    validateSeriesInput(body);
    // if ok, insert into database
    const results = await pool.query('INSERT INTO series (name, lowestValue, highestValue, unit, color, icon) VALUES (?, ?, ?, ?, ?, ?)', [body.name, body.minValue, body.maxValue, body.unit ?? null, body.color, body.icon ?? null]);
    // get location of newly inserted series from database
    const rows = await pool.query('SELECT id, name, lowestValue, highestValue, unit, color, icon FROM series WHERE id = ?', [results.insertId]);
    // response with new series inserted location
    res.status(201).location(`${req.baseUrl}/${results.insertId}`).json(toSeriesResponse(rows[0]));
})

// GET /api/series/{seriesId}
router.get('/:seriesId', async (req, res) => {
    // check database for specific seriesId received in Request
    const rows = await pool.query('SELECT id, name, lowestValue, highestValue, unit, color, icon FROM series WHERE id = ?', [req.params.seriesId]);
    const row = rows[0];
    if (row === undefined){
        throw new HttpError(404, `Specified series with id ${req.params.seriesId} not found.`);
    }
    // response if specified seriesId found
    res.json(toSeriesResponse(row));
})

// DELETE /api/series{seriesId}, requiresAdmin
router.delete('/:seriesId', requireAdmin, async (req, res) => {
    // try to delete specified seriesId
    const result = await pool.query('DELETE FROM series WHERE id = ?', [req.params.seriesId]);
    // check if anything was deleted
    if (result.affectedRows === 0){
        throw new HttpError(404, `Specified series with id ${req.params.seriesId} not found.`);
    }
    // response after correct delete
    res.status(204).end();
})

module.exports = router;