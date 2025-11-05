import { Request, Response, NextFunction } from 'express';
import { CalendarioService } from './calendario.service';
import { HttpStatus } from '@/utils/http-status';
 
export class CalendarioController {
    static async crea(req:Request, res:Response, next: NextFunction) {
        try {
            const calendario = await CalendarioService.creaCalendario(req.body);
            res.status(HttpStatus.CREATED).json({
                message: 'Calendario creato con successo.',
                data: calendario,
            });
        } catch (error) {
            next(error);
        }
    }

    static async disponibileConOrario(req: Request, res: Response, next: NextFunction) {
        try{
            // nel body: calendarioId - dataInizo - dataFine 
            const filters = req.body;
            const disponibile = await CalendarioService.disponibilePerIdeDataInizioFine(filters);
            if (!disponibile) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Range date non disponibili."
                });
                return;
            } 

            res.status(HttpStatus.OK).json({
                message: "Range di date disponibile per la prenotazione."
            });
            return; 

        } catch (error) {
            next(error);
        }
    }

    static async prelevaCalendari(req: Request, res: Response, next: NextFunction) {
        try{
            const calendari = await CalendarioService.recuperaCalendari();
            res.status(HttpStatus.OK).json(calendari);
        } catch (error) {
            next(error);
        }
    }

    static async archiviaCalenarioController(req: Request, res: Response, next: NextFunction) {
        try{
            const { id } = req.params;

            const calendario = await CalendarioService.archiviaCalendarioService(id);

            res.status(HttpStatus.OK).json({
                message: 'Calendario aggiornato con successo.',
                data: calendario
            });
        } catch (error) {
            next(error);
        }
    }

    static async singoloCalendario(req: Request, res: Response, next: NextFunction) {
        try {
            const calendario = await CalendarioService.calendarioById(req.params.id);
            res.status(HttpStatus.OK).json(calendario);
        } catch (error) {
            next(error);
        }
    }

    static async elimina(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await CalendarioService.eliminaCalendario(req.params.id);
            res.status(HttpStatus.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

}