// functions generateToken() and hashToken()

// https://stackoverflow.com/questions/55104802/nodejs-crypto-randombytes-to-string-hex-doubling-size

const crypto = require('node:crypto');

function generateToken(){
    return crypto.randomBytes(32).toString('hex');
}

function hashToken(token){
    return crypto.createHash('sha256')
                .update(token)
                .digest('hex');
}

module.exports = { generateToken, hashToken };