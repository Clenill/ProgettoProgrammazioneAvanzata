import express from 'express';
import { RisorsaController } from './risorsa.controller';
import { adminAuthStack } from '@/middlewares/auth.middleware';
const risorsaRouter = express.Router();

risorsaRouter.post('/nuovarisorsa', adminAuthStack, RisorsaController.nuovaRisorsa);
risorsaRouter.get('/prendirisorse', adminAuthStack, RisorsaController.recuperaRisorse);
risorsaRouter.get('/:id', adminAuthStack, RisorsaController.prelevaRisorsaPerId);
risorsaRouter.put('/:id', adminAuthStack, RisorsaController.aggiornaRisorsa);
risorsaRouter.delete('/:id', adminAuthStack, RisorsaController.cancellaRisorsa);

export default risorsaRouter;
