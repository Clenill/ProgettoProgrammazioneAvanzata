import { User } from '@/interfaces/user.interfaces';
import { validateSignUp, validateSignIn } from './auth.validator';
import repo from './auth.repo';
import { generateJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { CustomError } from '@/utils/custom-error';
// Service di registrazione nuovo utente
export class AuthService {
    static async registerUser(userData: User) {
        const { error } = validateSignUp(userData);
        if(error) {
            throw new CustomError(error.details[0].message, 400);
        }
        // Check se esiste utente con la stessa mail
        const existing = await repo.findUserByEmail(userData.email);
        if(existing) {
            throw new CustomError(`Email ${userData.email} già registrata`, 409);
        }
        const role = userData.role || 'utente';
        // spread Operator ..., l'iterable può essere espanso
        const newUser = await repo.createUser({
            ...userData,
            role,
        });
        return{ user: newUser };
    }
    // Service di login che stacca il token per l'utente. Email necessaria
    static async signInUser(userData: User) {
        const { error } = validateSignIn(userData);
        if(error) {
             throw new CustomError(error.details[0].message, 400);
        }
        const user = await repo.findUserByEmail(userData.email);
        if (!user) {
            throw new CustomError('Email non valida', 401);
        }
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = await generateJWT(
        payload,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    return { user, accessToken };
    }
}
