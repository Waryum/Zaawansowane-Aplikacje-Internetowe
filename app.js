// App creation, middleware registration and routes.

// requires Express
const express = require('express');

//will require adding other routes

// requires routes/system -- for checking /api/health, as "system" constant
const system = require('./routes/system');

// app creation
const app = express();

// will require adding app.use for other routes

// application is told to use /api/system.js (will route it as GET /api/health)
app.use('/api', system);



// export app -- specifically for server.js to "use"
module.exports = app;