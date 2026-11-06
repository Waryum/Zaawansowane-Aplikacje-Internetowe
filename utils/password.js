// two scripts: verifyPassword and hashPassword
const bcryptjs = require("bcryptjs");

// hashing function based on bcryptjs
async function hashPassword(password) {
    return await bcryptjs.hash(password, 12);
}

// password verification function based on bcryptjs
async function verifyPassword(hash, password){
     return await bcryptjs.compare(password, hash);
}

// export both functions
module.exports = {hashPassword, verifyPassword};