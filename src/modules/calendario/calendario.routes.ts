import express from 'express';
import { CalendarioController } from './calendario.controller';
import { authMiddleware, authorizeRoles, tokenCheckMiddleware } from '@/middlewares/auth.middleware';
const calendaroRouter = express.Router();

const userAuthStack = [authMiddleware, tokenCheckMiddleware];
const adminAuthStack = [authMiddleware, authorizeRoles('admin')];

calendaroRouter.post('/crea', authMiddleware, authorizeRoles('admin'), CalendarioController.crea);
calendaroRouter.get('/tutti', CalendarioController.prelevaCalendari);
calendaroRouter.get('/disponibile', userAuthStack, authorizeRoles('utente'), CalendarioController.disponibileConOrario);
calendaroRouter.get('/preleva/:id', CalendarioController.singoloCalendario);
calendaroRouter.delete('/elimina/:id', adminAuthStack, CalendarioController.elimina);

export default calendaroRouter;