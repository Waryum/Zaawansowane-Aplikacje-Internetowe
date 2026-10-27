// health check
const express = require('express'); //requires Express
const router = express.Router(); // requires Routes, and "app" is locally seen as "router"

// route for getting /health
router.get('/health', (req, res) => {
    //res.send('Hello World!');
    res.status(200).json({status: 'ok'}); // sets content-type json automatically
});

module.exports = router; // export this route