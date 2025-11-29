export class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {// costruttore 
        super(message);
        this.statusCode = statusCode;// proprietà aggiuntiva rispetto a Error
        this.stack = undefined; // evita di esporre la stackTrace
    }
}
