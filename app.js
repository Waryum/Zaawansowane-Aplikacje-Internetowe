// App creation, middleware registration and routes.

// requires Express
const express = require('express');

// requires routes/system -- for checking /api/health, as "system" constant
const system = require('./routes/system');

// notFound function
const notFound = require('./middleware/notFound');

// app creation
const app = express();

// will require adding app.use for other routes

// application is told to use /api/system.js (will route it as GET /api/health)
app.use('/api', system);




// end of routes, if no catch show error 404 not found
app.use(notFound);

// application is told to use express.json for error handling
app.use(express.json());


//


// export app -- specifically for server.js to "use"
module.exports = app;