import { NextFunction, Request, Response } from 'express';
import { addTokenToUser  } from './user.service';
import { HttpStatus } from '@/utils/http-status';

export  const addTokenToUserController = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const result = await addTokenToUser(req.body);

        res.status(HttpStatus.OK).json({
            message: "Token aggiunti all'utente con successo",
            data: result
        });
    } catch (error) {
        next(error);
    }
}
