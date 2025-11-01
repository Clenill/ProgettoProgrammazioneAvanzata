import express from 'express';
import { RichiestaController } from './richiesta.controller';
import { authorizeRoles, adminAuthStack, userAuthStack } from '@/middlewares/auth.middleware';
const richiestaRouter = express.Router();

richiestaRouter.post('/crea', userAuthStack, authorizeRoles('utente'), RichiestaController.crea);
richiestaRouter.get('/filtra', userAuthStack, authorizeRoles('utente'), RichiestaController.prelevaRichieste);
richiestaRouter.put('/modifica/:id',  adminAuthStack, RichiestaController.destinoRichiesta);
richiestaRouter.get('/richiestecalendario/:calendarioId',  adminAuthStack, RichiestaController.statoRichiesteCalendario);
richiestaRouter.delete('/elimina/:id',  userAuthStack, authorizeRoles('utente'), RichiestaController.cancellazionePrenotazione);
richiestaRouter.post('/recuperafiltrate', userAuthStack, authorizeRoles('utente'), RichiestaController.listaFiltrata);
export default richiestaRouter;
