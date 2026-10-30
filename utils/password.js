// two scripts: verifyPassword and hashPassword
const argon2 = require("argon2");

// hashing function based on argon2
async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}

// password verification function based on argon2
async function verifyPassword(hash, password){
    const isValid = await argon2.verify(hash, password);
    return isValid;
}

// export both functions
module.exports = {hashPassword, verifyPassword};