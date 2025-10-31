import { CustomError } from '@/utils/custom-error';
import CalendarioRepo from './calendario.repo';
import { Calendario } from '@/interfaces/calendario.interfaces';
import { validateCalendario } from './calendario.validator';
import RisorsaRepo from '../risorsa/risorsa.repo';
import { RichiestaService } from '../richiesta/richiesta.service';

export class CalendarioService {
    static async creaCalendario(data: Calendario) {
        const { error } = validateCalendario(data);
        if(error) {
            throw new CustomError(error.details[0].message, 400);
        }

        // Verifica esistenza risorsa associata
        const risorsa = await RisorsaRepo.findById(data.risorsaId);
        if(!risorsa) {
            throw new CustomError('Risorsa non associata al calendario.', 404);
        }
        // Verifica che non ci sia già un calendario per la risorsa
        const existing = await CalendarioRepo.findByRisorsa(data.risorsaId);
        if(existing) {
            throw new CustomError('Calendario già esistente per questa risorsa.', 409);
        }

        // In caso tutto ok allora si crea un calendario per la risorsa
        const newCalendario = await CalendarioRepo.create({
            risorsaId: data.risorsaId,
            tokenCostoOrario: data.tokenCostoOrario,
        });

        return newCalendario;
    }

    static async disponibilePerIdeDataInizioFine(filters: any){
        const disponibile = await RichiestaService.verificaDisponibilitaRange(filters);

        return disponibile; // true o false
    }

    static async recuperaCalendari() {
        return await CalendarioRepo.findAll();
    }

    static async calendarioById(id: string) {
        const calendario = await CalendarioRepo.findById(id);
        if (!calendario) {
            throw new CustomError('Calendario non trovato.', 404);
        } 
        return calendario;
    }

    // Si chiama il service di Richieste e verifica se ci sono richieste approved e di data successiva
    // Nel caso non ci sono richieste che soddisfano i parametri si procede alla cancellazione del calendario
    static async eliminaCalendario(id: string) {
        const calendario = await CalendarioRepo.findById(id);
        if (!calendario) {
            throw new CustomError('Calendario non trovato.', 404);
        } 
        
        const richiesteAttive = await RichiestaService.esistonoRichiesteAttive(id);
        if (richiesteAttive) {
            throw new CustomError(
                'Impossibile eliminare: ci sono prenotazioni attive rispetto alla data odierna.',
                409
            );
        }
        
        await CalendarioRepo.delete(id);

        return { message: 'Calendario eliminato con successo.' };
    }
}