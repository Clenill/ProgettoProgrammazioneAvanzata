import express from 'express';
import { CalendarioController } from './calendario.controller';
import { userAuthStack, adminAuthStack, authorizeRoles } from '@/middlewares/auth.middleware';
const calendaroRouter = express.Router();

calendaroRouter.post('/crea', adminAuthStack, CalendarioController.crea);
calendaroRouter.get('/tutti', userAuthStack, authorizeRoles('utente'), CalendarioController.prelevaCalendari);
calendaroRouter.get('/disponibile', userAuthStack, authorizeRoles('utente'), CalendarioController.disponibileConOrario);
calendaroRouter.get('/preleva/:id', userAuthStack, authorizeRoles('utente'), CalendarioController.singoloCalendario);
calendaroRouter.delete('/elimina/:id', adminAuthStack, CalendarioController.elimina);
calendaroRouter.post('/archivia/:id', adminAuthStack, CalendarioController.archiviaCalenarioController);
export default calendaroRouter;