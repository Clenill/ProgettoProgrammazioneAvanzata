import { NextFunction, Request, Response } from 'express';
import { addTokenToUser  } from './user.service';

export  const addTokenToUserController = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const result = await addTokenToUser(req.body);

        res.status(200).json({
            message: "Token aggiunti all'utente con successo",
            data: result
        });
    } catch (error) {
        next(error);
    }
}
