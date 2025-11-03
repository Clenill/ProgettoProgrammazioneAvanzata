import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { JWT_EXPIRATION, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from '@/config';

export const gJWT = async(payload: any): Promise<string> => {
    try {
        if(!JWT_EXPIRATION) {
             console.warn('⚠️ JWT_EXPIRATION non definito, uso valore di default (1h)');
        }
        return jwt.sign(payload, JWT_PRIVATE_KEY as string, {
            algorithm: 'RS256',
            expiresIn: JWT_EXPIRATION || '1h'
        });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const vJWT = async(token: string): Promise<jwt.JwtPayload> => {
    try {
        const data = jwt.verify(token, JWT_PUBLIC_KEY as string, {
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
