import { Request, Response, NextFunction } from 'express';
import { CalendarioService } from './calendario.service';
import { CustomError } from '@/utils/custom-error';
import { getUserProfileService } from '@/modules/user/user.service';
export class CalendarioController {
    static async crea(req:Request, res:Response, next: NextFunction) {
        try {
            const calendario = await CalendarioService.creaCalendario(req.body);
            res.status(201).json({
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
                res.status(400).json({
                    message: "Range date non disponibili."
                });
                return;
            } 

            res.status(200).json({
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
            res.status(200).json(calendari);
        } catch (error) {
            next(error);
        }
    }

    static async singoloCalendario(req: Request, res: Response, next: NextFunction) {
        try {
            const calendario = await CalendarioService.calendarioById(req.params.id);
            res.status(200).json(calendario);
        } catch (error) {
            next(error);
        }
    }

    static async elimina(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await CalendarioService.eliminaCalendario(req.params.id);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

}