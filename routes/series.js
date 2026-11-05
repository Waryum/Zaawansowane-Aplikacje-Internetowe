// series tag activities

// authorization tag activities
// required functions
const express = require('express');
const pool = require("../db/connection");
const HttpError = require("../utils/errors");

// module for route creation
const router = express.Router();

// function for changing database names into expected response valus

// GET /api/series request router
router.get('/', async (req, res) => {
    // check database for a list of series
    const rows = await pool.query('SELECT id, name, lowestValue, highestValue, unit, color, icon FROM series ORDER BY id);
    //res.send('Hello World!');
    res.status(200).json(
        {
            status: 'ok',
            data: rows // needs correcting
        }
    );
});