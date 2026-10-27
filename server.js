// app.js start and creating a port for listening

// require .env file support
require('dotenv').config();

// require app.js file as constant "app"
const app = require('./app');

// express server port number
const PORT = process.env.PORT || 3500;

// require pool connection from mariaDB
const pool = require('./db/connection');

// function for testing mariaDB pool
async function start(){
    console.log('TESTING DATABASE');
    // testing if the database exists and we were capable of connecting with
    // credentials from .env file.
    await pool.query('SELECT 1');
    console.log('Database connection OK');
    // starting the server listening on PORT
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
}

// starting the application, if no database connection, server won't start.
start().catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // app won't start without a successfull database connection
});