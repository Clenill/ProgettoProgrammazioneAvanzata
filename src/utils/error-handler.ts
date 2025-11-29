import { Request, Response, NextFunction } from 'express';
import { CustomError } from './custom-error';
import { HttpStatus } from './http-status';
// Middleware di errore ha quattro parametri, il parametro err accetta errore di JS o CustomError
export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // Se l'errore deriva da CustomError usa statusCode altrimenti 500.
    const statusCode = err instanceof CustomError ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    // popola la variabile messagge se err ha un messaggio altrimetni utilizza quello a destra
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: message });
};
