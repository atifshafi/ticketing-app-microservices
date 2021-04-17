// Defining a class of error to use it to identify specific types of error
export class DatabaseConnectionError extends Error {
    reason = 'Error connecting to database'
    statusCode = 500;

    constructor() {
        super();
        // Need to do this since 'Error' is a built-in object
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors() {
        return [{message: this.reason}]
    }

}
