// two scripts: verifyPassword and hashPassword
const argon2 = require("argon2");

// hashing function based on argon2
async function hashPassword(password) {
    return await argon2.hash(password);
}

// password verification function based on argon2
async function verifyPassword(hash, password){
     return await argon2.verify(hash, password);
}

// export both functions
module.exports = {hashPassword, verifyPassword};