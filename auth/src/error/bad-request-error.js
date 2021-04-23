// Defining a class of error to use it to identify specific types of error
export class BadRequestError extends Error {
    statusCode = 400;

    constructor(error) {
        super();
        this.error = error;
        // Need to do this since 'Error' is a built-in object
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeErrors() {
        return [{message: this.error}]
    }

}