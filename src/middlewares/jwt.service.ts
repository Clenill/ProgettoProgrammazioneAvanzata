import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
const privateKey = fs.readFileSync(path.join(__dirname, '../../keys/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../../keys/public.key'), 'utf8');

export const gJWT = async(payload: any): Promise<string> => {
    try {
        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const vJWT = async(token: string): Promise<jwt.JwtPayload> => {
    try {
        const data = jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        });

        if(typeof data === 'string') {
            throw new Error('Invalid token payload');
        }

        return data as jwt.JwtPayload;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
