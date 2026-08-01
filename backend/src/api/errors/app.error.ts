export class AppError extends Error {
    constructor(public statusCode: number, public message: string) {
        super(message);
    }
}

export class NotFound extends AppError {
    constructor(message: string = "Resource not found") {
        super(404, message);
    }
}

export class BadRequest extends AppError {
    constructor(message: string = "Bad request") {
        super(400, message);
    }
}