// creation of admin account

// require .env file support
require('dotenv').config();

// require pool connection from mariaDB
const pool = require('../db/connection');

// require password.js file with password functions
const passwordUtils = require('../utils/password');

// env parameters - username and password
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;


async function main(){
    // password validation, does it have a correct value, is of a correct length?
    if ((!ADMIN_PASSWORD) || (ADMIN_PASSWORD.length < 8)) {
        throw new Error('Please specify a valid ADMIN_PASSWORD');
    }
    // username validation, is it given in the .env file
    if ((!ADMIN_USERNAME) || (ADMIN_USERNAME.length > 50)) {
        throw new Error('Please specify a valid ADMIN_USERNAME');
    }
    // does the account already exist? if yes message and return
    const usernameCheck = await pool.query('SELECT id FROM admins WHERE username = ?', [ADMIN_USERNAME]);
    if (usernameCheck.length > 0){
        console.log(`Specified account: ${ADMIN_USERNAME} already exists`);
        return;
    }
    // hashing the password
    const passwordHash = await passwordUtils.hashPassword(ADMIN_PASSWORD);
    // INSERT into database
    await pool.query('INSERT INTO admins (username, passwordHash) VALUES (?, ?)', [ADMIN_USERNAME, passwordHash]);
    console.log(`Successfully created account: ${ADMIN_USERNAME}`);
}


// main function asynch. usage with pool ending in case of error.
main().catch((err) =>{
    console.error('Admin creation failed:', err.message);
    process.exitCode = 1; // doesn't end process sets exit code allowing for pool.end()
}).finally(() => pool.end());