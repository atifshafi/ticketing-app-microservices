// Defining a class of error to use it to identify specific types of error
export class RequestValidationError extends Error {
    statusCode = 400;

    constructor(errors) {
        super();
        this.errors = errors;
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        // 'RequestValidationError' obj will have an array of errors as a property. Mapping over them would allow us to access those errors.
        const formattedErrors = this.errors.map(error => {
            return {message: error.msg, field: error.param};
        });

        return {errors: formattedErrors}
    }
}
