import { repo } from './user.repo';
import { CustomError } from '@/utils/custom-error';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { validateAddToken } from './user.validator';

export const getUserProfileService = async (accessToken: string) => {
    const decodeToken = await verifyJWT(
        accessToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    const userId = decodeToken.userId;

    const user = await repo.getUserProfile(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    return user;
};

export const userByIdService = async (userId: string) => {
    const user = await repo.getUserProfile(userId);
    if(!user) {
        throw new CustomError('Utente non trovato', 404);
    }
    return user;
}

export const modificaUserTokensService = async (
    userId: string,
    tokenChange: number,
): Promise<void> => {
    const user = await repo.getUserProfile(userId);
    if(!user) {
        throw new CustomError('User not found', 404);
    }

    const newBalance = user.tokenDisponibili + tokenChange;
    if (newBalance < 0) {
        throw new CustomError('Token insufficienti per completare l’operazione.', 400);
    }
    await repo.modificaUserTokens(userId, newBalance);
};

export const addTokenToUser = async (data: any) => {
    const { error } = validateAddToken(data);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }

    const { userId, token } = data;

    const user = await repo.getUserProfile(userId);
    if(!user) {
        throw new CustomError("Utente non trovato", 404);
    }

    await repo.addToken(userId, token);

    return {
        userId,
        added: token,
    };
}