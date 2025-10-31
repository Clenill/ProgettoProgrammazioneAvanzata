import express from 'express';
import { AuthController } from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', AuthController.register);
authRouter.post('/signin', AuthController.signIn);
export default authRouter;
