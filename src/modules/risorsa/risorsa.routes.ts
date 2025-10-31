import express from 'express';
import { RisorsaController } from './risorsa.controller';

const risorsaRouter = express.Router();

risorsaRouter.post('/nuovarisorsa', RisorsaController.nuovaRisorsa);
risorsaRouter.get('/prendirisorse', RisorsaController.recuperaRisorse);
risorsaRouter.get('/:id', RisorsaController.prelevaRisorsaPerId);
risorsaRouter.put('/:id', RisorsaController.aggiornaRisorsa);
risorsaRouter.delete('/:id', RisorsaController.cancellaRisorsa);

export default risorsaRouter;
