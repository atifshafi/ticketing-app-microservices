export class NotFoundError extends Error {
    reason = 'Not Found'
    statusCode = 404;

    constructor() {
        super();
        // Need to do this since 'Error' is a built-in object
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeErrors() {
        return [{message: this.reason}]
    }

}
