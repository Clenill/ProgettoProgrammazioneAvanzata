import express from 'express';
import { addTokenToUserController } from './user.controller';
import { authorizeRoles } from '@/middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.put('/addtokens', authorizeRoles("admin"), addTokenToUserController);
export default userRouter;
