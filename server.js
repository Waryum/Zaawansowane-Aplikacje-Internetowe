// app.js start and creating a port for listening

// require .env file support
require('dotenv').config();

// require app.js file as constant "app"
const app = require('./app');

// port express serwer
const PORT = process.env.PORT || 3500;

// require pool connection from mariaDB
const pool = require('./db/connection');
// test mariadb connection
const poolTest = await pool.query('SELECT 1');

// starting the server listening on PORT
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));