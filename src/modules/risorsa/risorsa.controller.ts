import { Request, Response, NextFunction } from 'express';
import { RisorsaService } from './risorsa.service';
import { HttpStatus } from '@/utils/http-status';

export class RisorsaController {
    static async nuovaRisorsa(req: Request, res: Response, next: NextFunction) {
        try {
            const risorsa = await RisorsaService.creaRisorsa(req.body);
            res.status(HttpStatus.CREATED).json({
                message: 'Risorsa creata con successo.',
                data: risorsa,
            });
        } catch (error) {
            next(error);
        }
    }

    static async recuperaRisorse(req: Request, res: Response, next: NextFunction) {
        try {
            const risorse = await RisorsaService.tutteLeRisorse();
            res.status(HttpStatus.OK).json(risorse);
        } catch (error) {
            next(error);
        }
    }

    static async prelevaRisorsaPerId(req: Request, res: Response, next: NextFunction) {
        try {
            const risorsa = await RisorsaService.risorsaById(req.params.id);
            res.status(HttpStatus.OK).json(risorsa);
        } catch (error) {
            next(error);
        }
    }

    static async aggiornaRisorsa(req: Request, res: Response, next: NextFunction) {
        try {
            const risorsa = await RisorsaService.modificaRisorsa(req.params.id, req.body);
            res.status(HttpStatus.OK).json({
                message: 'Risorsa aggiornata con successo.',
                data: risorsa,
            });
        } catch (error) {
            next(error);
        }
    }

    static async cancellaRisorsa(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await RisorsaService.deleteRisorsa(req.params.id);
            res.status(HttpStatus.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}