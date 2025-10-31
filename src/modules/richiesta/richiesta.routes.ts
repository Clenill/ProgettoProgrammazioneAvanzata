import express from 'express';
import { RichiestaController } from './richiesta.controller';
import { authMiddleware, authorizeRoles, tokenCheckMiddleware } from '@/middlewares/auth.middleware';
const richiestaRouter = express.Router();

richiestaRouter.post('/crea', authMiddleware, tokenCheckMiddleware, authorizeRoles('utente'), RichiestaController.crea);
richiestaRouter.get('/filtra', authMiddleware, tokenCheckMiddleware, authorizeRoles('utente'), RichiestaController.prelevaRichieste);
richiestaRouter.put('/modifica/:id',  authMiddleware, authorizeRoles('admin'), RichiestaController.destinoRichiesta);
richiestaRouter.get('/richiestecalendario/:calendarioId',  authMiddleware, authorizeRoles('admin'), RichiestaController.statoRichiesteCalendario);
richiestaRouter.delete('/elimina/:id',  authMiddleware, tokenCheckMiddleware, authorizeRoles('utente'), RichiestaController.cancellazionePrenotazione);
richiestaRouter.post('/recuperafiltrate', authMiddleware, tokenCheckMiddleware, authorizeRoles('utente'), RichiestaController.listaFiltrata);
export default richiestaRouter;
