import { CustomError } from '@/utils/custom-error';
import { verifyJWT } from './jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { NextFunction, Request, Response } from 'express';
import { userByIdService } from '@/modules/user/user.service';

// Decodifica il token JWT passato dal metodo authMiddleware
// In caso di token assente o non valido solleva un errore
const decodeToken = async (header: string | undefined) => {
    if (!header) {
        throw new CustomError('Authorization header missing', 401);
    }

    const payload = await verifyJWT(header, JWT_ACCESS_TOKEN_SECRET as string);

    return payload;
};

// Middleware che verifica che preleva dall'header della richiesta il token 
// tramite la funzione decodeToken lo verifica
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('Authorization') || req.header('authorization');
        req.context = await decodeToken(authHeader);
        
        next();
    } catch (error) {
        next(error);
    } 
};

// Check sui token > 0 per l'utente
export const tokenCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.context; // contiene userId tra gli altri
        if(!payload?.userId) {
            throw new CustomError("User mancante nel contesto", 401);
        }

        const user = await userByIdService(payload.userId);
        if(!user) {
            throw new CustomError("Utente non trovato", 404);
        }

        if(user.tokenDisponibili <= 0) {
            throw new CustomError("Token esauriti. Non puoi effettuare altre operazioni.", 401);
        }
        next();
    } catch(error) {
        next(error);
    }
}

// Middleware per controllo ruoli, gli viene passato il ruolo 
// è possibile ammettere più ruoli chiamandola conn ('admin', 'user')
export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.context;

        if (!user) {
            throw new CustomError('Utente non autenticato', 401);
        }

        if (!allowedRoles.includes(user.role)) {
            throw new CustomError('Accesso non autorizzato', 403);
        }

        next();
    };
};