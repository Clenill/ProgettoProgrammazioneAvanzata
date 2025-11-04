import { Request, Response, NextFunction } from 'express';
import { RichiestaService } from './richiesta.service';
import { CustomError } from '@/utils/custom-error';
import { validateFiltroRichieste } from './richiesta.validator';
import { HttpStatus } from '@/utils/http-status';

export class RichiestaController {
    static async crea(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Utente già autenticato e autorizzato nel middleware
            const user = req.context;
            if(!user) {
                throw new CustomError("User mancante", HttpStatus.UNAUTHORIZED);
            }
            const richiesta = await RichiestaService.creaRichiesta(req.body, user);
            // In caso di stato invalid la risposta è leggermente diversa
            if (richiesta.stato === 'invalid') {
                res.status(HttpStatus.OK).json({
                    message: 'Richiesta registrata ma non valida per token insufficienti',
                    data: richiesta
                });
                return;
            }
            res.status(HttpStatus.CREATED).json({
                message: 'Richiesta creata con successo.',
                data: richiesta,
            });
            return;
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
            res.status(HttpStatus.OK).json({ 
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

            res.status(HttpStatus.OK).json({
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
                throw new CustomError("User mancante", HttpStatus.UNAUTHORIZED);
            }

            const response = await RichiestaService.cancellaRichiesta(idRichiesta, user);

            res.status(HttpStatus.OK).json({
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
                throw new CustomError(error.details[0].message, HttpStatus.BAD_REQUEST);
            }

            const richieste = await RichiestaService.tutteLeRichiesteFiltrate(req.body);

            res.status(HttpStatus.OK).json({
                message: richieste.length ? "Richieste trovate." : "Nessuna richiesta trovata.",
                count: richieste.length,
                data: richieste
            });
        } catch (error) {
            next(error);
        }
    }

    static async statoRichiesteCalendario(req: Request, res: Response, next: NextFunction) {
        try {
            const calendarioId = req.params.calendarioId;

            const richieste = await RichiestaService.richiestePerCalendario(calendarioId);

            res.status(HttpStatus.OK).json({
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
