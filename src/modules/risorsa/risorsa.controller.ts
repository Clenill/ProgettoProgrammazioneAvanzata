import { Request, Response, NextFunction } from 'express';
import { RisorsaService } from './risorsa.service';

export class RisorsaController {
    static async nuovaRisorsa(req: Request, res: Response, next: NextFunction) {
        try {
            const risorsa = await RisorsaService.creaRisorsa(req.body);
            res.status(201).json({
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
            res.status(200).json(risorse);
        } catch (error) {
            next(error);
        }
    }

    static async prelevaRisorsaPerId(req: Request, res: Response, next: NextFunction) {
        try {
            const risorsa = await RisorsaService.risorsaById(req.params.id);
            res.status(200).json(risorsa);
        } catch (error) {
            next(error);
        }
    }

    static async aggiornaRisorsa(req: Request, res: Response, next: NextFunction) {
        try {
            const risorsa = await RisorsaService.modificaRisorsa(req.params.id, req.body);
            res.status(200).json({
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
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}