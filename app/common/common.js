exports.ValidationError = class ValidationError extends Error {
    constructor(message) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message);

        this.name = 'ValidationError';
        // Custom debugging information
        this.code = 'VALIDATION_ERROR';
    }
};

exports.AuthenticationError = class AuthenticationError extends Error {
    constructor(message) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message);

        this.name = 'AuthenticationError';
        // Custom debugging information
        this.code = 'AUTH_ERROR';
    }
};

exports.EntityNotFoundError = class EntityNotFoundError extends Error {
    constructor(message) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message);

        this.name = 'EntityNotFound';
        // Custom debugging information
        this.code = 'ENTITY_NOT_FOUND';
    }
};

exports.errorHandling = (err, callback) => {
    console.log(err);
    switch (err.code) {
        case 'ER_DUP_ENTRY':
            callback(409, 'Duplicate entry.');
            break;
        case 'VALIDATION_ERROR':
            callback(400, err.message);
            break;
        case 'AUTH_ERROR':
            callback(401, err.message);
            break;
        case 'ENTITY_NOT_FOUND':
            callback(404, err.message);
            break;
        default:
            callback(503, 'Cannot connect to database / System error.');
    }
};
