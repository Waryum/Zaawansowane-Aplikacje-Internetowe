// require general error handling script
const HttpError = require('../utils/errors');

// 404 not found error function, specifies status code and detail
function notFound (req, res, next){
    next(new HttpError(404, `Path ${req.originalUrl} not found`));
}

// function export
module.exports = notFound;