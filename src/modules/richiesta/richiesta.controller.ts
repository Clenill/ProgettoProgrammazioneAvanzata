import { Request, Response, NextFunction } from 'express';
import { RichiestaService } from './richiesta.service';
import { CustomError } from '@/utils/custom-error';
import { validateFiltroRichieste } from './richiesta.validator';

export class RichiestaController {
    static async crea(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Utente già autenticato e autorizzato nel middleware
            const user = req.context;
            if(!user) {
                throw new CustomError("User mancante", 401);
            }
            const richiesta = await RichiestaService.creaRichiesta(req.body, user);

            res.status(201).json({
                message: 'Richiesta creata con successo.',
                data: richiesta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async prelevaRichieste(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters = req.body;
            const richieste = await RichiestaService.tutteLeRichieste(filters);
            const messaggio = richieste.length > 0 
                ? "Richieste recuperate con successo."
                : "Nessuna richiesta recuperata.";
            res.status(200).json({ 
                message: messaggio,
                count: richieste.length,
                risposta: richieste ,
            });
        } catch (error) {
            next(error);
        }
    }

    static async destinoRichiesta(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const decision = req.body;

            const richiesta = await RichiestaService.aggiornaStatoRichiestaPending(id, decision);

            res.status(200).json({
                message: 'Stato della richiesta aggiornato con successo.',
                data: richiesta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async cancellazionePrenotazione(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const idRichiesta = req.params.id;
            const user  = req.context;
            if(!user) {
                throw new CustomError("User mancante", 401);
            }

            const response = await RichiestaService.cancellaRichiesta(idRichiesta, user);

            res.status(200).json({
                message: 'Richiesta cancellata con successo.',
                data: response
            });
        } catch ( error ) {
            next(error);
        }
    }

    static async listaFiltrata(req: Request, res: Response, next: NextFunction) {
        try {
            const { error } = validateFiltroRichieste(req.body);
            if (error) {
                throw new CustomError(error.details[0].message, 400);
            }

            const richieste = await RichiestaService.tutteLeRichiesteFiltrate(req.body);

            res.status(200).json({
                message: richieste.length ? "Richieste trovate." : "Nessuna richiesta trovata.",
                count: richieste.length,
            data: richieste.map(r => ({
                id: r.id,
                stato: r.stato,
                calendarioId: r.calendarioId,
                dataInizio: r.dataInizio,
                dataFine: r.dataFine
            }))
            });
        } catch (error) {
            next(error);
        }
    }

    static async statoRichiesteCalendario(req: Request, res: Response, next: NextFunction) {
        try {
            const calendarioId = req.params.calendarioId;

            const richieste = await RichiestaService.richiestePerCalendario(calendarioId);

            res.status(200).json({
                message: richieste.length
                ? "Richieste trovate."
                : "Nessuna richiesta trovata per questo calendario.",
                count: richieste.length,
                data: richieste
            });
        } catch (error) {
            next(error);
        }
    }
}
