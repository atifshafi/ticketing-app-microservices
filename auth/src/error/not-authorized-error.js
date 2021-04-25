export class NotAuthorizedError extends Error {
    reason = 'Not Authorized'
    statusCode = 400;

    constructor() {
        super();
        // Need to do this since 'Error' is a built-in object
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    serializeErrors() {
        return [{message: this.reason}]
    }

}