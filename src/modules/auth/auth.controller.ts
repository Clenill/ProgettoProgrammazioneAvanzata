import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
// Registrazione di un utente username e email obbligatori, role facoltativo
export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            const response = await AuthService.registerUser(userData);

            res.status(201).json({
                message: 'Utente registrato con successo.',
                data: response.user,
            });
        } catch (error) {
            next(error);
        }
    }

    // Login utente
    static async signIn(req: Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const credentials = req.body;
            const response = await AuthService.signInUser(credentials);

            res.status(200).json({
                message: 'Accesso effettuato con successo.',
                data: {
                    accessToken: response.accessToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
