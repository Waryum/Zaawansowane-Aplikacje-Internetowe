// series tag activities

// authorization tag activities
// required functions
const express = require('express');
const pool = require("../db/connection");

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

// GET /api/series request router
router.get('/', async (req, res) => {
    // check database for a list of series
    const rows = await pool.query('SELECT id, name, lowestValue, highestValue, unit, color, icon FROM series ORDER BY id');
    //response in json
    res.json(rows.map(toSeriesResponse));
});

module.exports = router;