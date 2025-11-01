import express from 'express';
import { addTokenToUserController } from './user.controller';
import { adminAuthStack } from '@/middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.put('/addtokens', adminAuthStack, addTokenToUserController);
export default userRouter;
