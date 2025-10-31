import authRouter from '@/modules/auth/auth.routes';
import userRouter from '@/modules/user/user.routes';
import risorsaRouter from '@/modules/risorsa/risorsa.routes';
import calendaroRouter from '@/modules/calendario/calendario.routes';
import richiestaRouter from '@/modules/richiesta/richiesta.routes';
import express from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = express.Router();

// Rotta per la registrazione di un nuovo utente
router.use('/auth', authRouter);
// Rotta per il ruolo Utente
router.use('/user', authMiddleware, userRouter);
// Rotta CRUD risorse
router.use('/risorse', risorsaRouter);
// Rotta CRUD calendario
router.use('/calendario', calendaroRouter);
// Rotta per richieste
router.use('/richieste', richiestaRouter);
export default router;
