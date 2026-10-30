// class for displaying and dealing with errors

// inspiration: https://itztalhaa.medium.com/custom-error-class-and-centralized-error-handling-in-nodejs-03887eb65793


const { STATUS_CODES } = require('node:http');

// general class for dealing with error codes
class HttpError extends Error {
    constructor(status, detail){
        const title = STATUS_CODES[status] || 'Error';
        super(detail || title);
        this.name = 'HttpError';
        this.status = status;
        this.title = title;
        this.detail = detail;
    }
}

module.exports = HttpError;