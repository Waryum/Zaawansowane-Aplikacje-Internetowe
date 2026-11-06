// App creation, middleware registration and routes.

// requires Express
const express = require('express');
// requires routes/system -- for checking /api/health, as "system" constant
const system = require('./routes/system');
// authorization route
const authRouter = require('./routes/auth');
// series route
const series = require('./routes/series');
// sensors route
const sensors = require('./routes/sensors');
// measurements route
const measurements = require('./routes/measurements');

// requireJsonAccept function
const requireJsonAccept = require('./middleware/requireJsonAccept');
// checkContentType function
const checkContentType = require('./middleware/checkContentType');

// notFound function
const notFound = require('./middleware/notFound');
// errorHandler function
const errorHandler = require('./middleware/errorHandler');

// app creation
const app = express();

// application is told to use express.json
app.use(express.json());

// application is told to use function requireJsonAccept
app.use(requireJsonAccept);
// application is told to use function checkContentType
app.use(checkContentType);

// application is told to use /api/system.js (will route it as GET /api/health)
app.use('/api', system);
// application is told to use /api/auth, authorization method
app.use('/api/auth', authRouter);
// application is told to use /api/series
app.use('/api/series', series);
// application is told to use /api/sensors
app.use('/api/sensors', sensors);
// application is told to use /api/measurements
app.use('/api/measurements', measurements);



// end of routes, if no catch show error 404 not found
app.use(notFound);

// error handler
app.use(errorHandler);

// export app -- specifically for server.js to "use"
module.exports = app;