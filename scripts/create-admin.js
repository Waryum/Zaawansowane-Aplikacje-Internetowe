// creation of admin account

// require .env file support
require('dotenv').config();

// require pool connection from mariaDB
const pool = require('../db/connection');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// checking length of ADMIN_USERNAME
if (ADMIN_USERNAME.length < 1 || ADMIN_USERNAME.length > 8){
    console.log('Admin Username should be at least 8 characters long');
    pool.end();
}

// is supposed to check if the new username is in the database
async function checkAdminUsername(){
    await pool.query('SELECT EXISTS (SELECT *  FROM admins WHERE username = ?)', ADMIN_USERNAME);


}