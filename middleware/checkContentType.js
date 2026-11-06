// middleware for checking Content-Type
// require general error handling script
const HttpError = require('../utils/errors');
function checkContentType(req, res, next){
    if (['PATCH', 'POST', 'PUT'].includes(req.method) && req.is('application/json') === false){
        throw new HttpError(415, 'Content-Type header must be set to "application/jscon".');
    }
    next();
}
//export module
module.exports = checkContentType;