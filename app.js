// App creation, middleware registration and routes.

// requires Express
const express = require('express');

// requires routes/system -- for checking /api/health, as "system" constant
const system = require('./routes/system');

// notFound function
const notFound = require('./middleware/notFound');
// errorHandler function
const errorHandler = require('./middleware/errorHandler');

// app creation
const app = express();

// application is told to use /api/system.js (will route it as GET /api/health)
app.use('/api', system);


// application is told to use express.json for error handling
app.use(express.json());

// end of routes, if no catch show error 404 not found
app.use(notFound);

// if any other type of undefined error, rely on errorHandler
app.use(errorHandler);


// export app -- specifically for server.js to "use"
module.exports = app;