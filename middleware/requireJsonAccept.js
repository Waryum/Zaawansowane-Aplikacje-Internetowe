// middleware for responding to /application/xml
// require general error handling script
const HttpError = require('../utils/errors');
function requireJsonAccept(req, res, next) {
    if (req.accepts(['application/json', 'application/problem+json']) === false){
        throw new HttpError(406, 'Application requires JSON');
    }
    next();
}
// export module
module.exports = requireJsonAccept;