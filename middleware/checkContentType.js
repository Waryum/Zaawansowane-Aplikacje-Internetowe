// middleware for checking Content-Type
// require general error handling script
const HttpError = require('../utils/errors');
function checkContentType(req, res, next){
    const hasBody = req.get('Transfer-Encoding') !== undefined || Number(req.get('Content-Length')) > 0;

    if (['PATCH', 'POST', 'PUT'].includes(req.method) && req.is('application/json') === false){
        throw new HttpError(415, 'Content-Type header must be set to "application/json".');
    }
    next();
}
//export module
module.exports = checkContentType;