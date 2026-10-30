// require basic HttpError function
const HttpError = require('../utils/errors');

function errorHandler(err, req, res, next){
    let error = err;

    // broken JSON from express.json()
    if (error.type === 'entity.parse.failed'){
        error = new HttpError(400, 'Malformed JSON body');
    }

    // unexpected error - app shouldn't show the entire stack to the client
    if (!(error instanceof HttpError)){
        console.error(err);
        error = new HttpError(500);
    }

    // responses should generally be in the form of Problem Details
    res.status(error.status)
        .type('application/problem+json')
        .json({
            type: 'about:blank',
            title: error.title,
            status: error.status,
            detail: error.detail,
            instance: req.originalUrl,
        });
}

// export of function errorHandler
module.exports = errorHandler;