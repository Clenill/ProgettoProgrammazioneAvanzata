import jwt from 'jsonwebtoken';

export const generateJWT = async (payload: any, secretKey: string) => {
    try {
        const token = jwt.sign(payload, secretKey);
        return token;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
// TODO RS256 
export const verifyJWT = async (
    token: string,
    secretKey: string,
): Promise<jwt.JwtPayload> => {
    try {
        const data = jwt.verify(token, secretKey);

        if (typeof data === 'string') {
            throw new Error('Invalid token payload');
        }

        return data as jwt.JwtPayload;
    } catch (error: any) {
        throw new Error(error.message);
    } // TODO due login che staccano il token admin e user
};
