import { CustomError } from '@/utils/custom-error';
import CalendarioRepo from './calendario.repo';
import { Calendario } from '@/interfaces/calendario.interfaces';
import { validateCalendario } from './calendario.validator';
import RisorsaRepo from '../risorsa/risorsa.repo';
import { RichiestaService } from '../richiesta/richiesta.service';
import { HttpStatus } from '@/utils/http-status';

export class CalendarioService {
    static async creaCalendario(data: Calendario) {
        const { error } = validateCalendario(data);
        if(error) {
            throw new CustomError(error.details[0].message, HttpStatus.BAD_REQUEST);
        }

        // Verifica esistenza risorsa associata
        const risorsa = await RisorsaRepo.findById(data.risorsaId);
        if(!risorsa) {
            throw new CustomError('Risorsa non associata al calendario.', HttpStatus.NOT_FOUND);
        }
        // Verifica che non ci sia già un calendario per la risorsa
        const existing = await CalendarioRepo.findByRisorsa(data.risorsaId);
        if(existing) {
            throw new CustomError('Calendario già esistente per questa risorsa.', HttpStatus.CONFLICT);
        }

        // In caso tutto ok allora si crea un calendario per la risorsa
        const newCalendario = await CalendarioRepo.create({
            risorsaId: data.risorsaId,
            tokenCostoOrario: data.tokenCostoOrario,
            isArchived: false,
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
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        } 
        return calendario;
    }

    // Service per archiviare un calendario
    static async archiviaCalendarioService(id: string) {
        const calendario = await CalendarioRepo.findById(id);
        if(!calendario) {
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        }
        if(calendario.isArchived) {
            throw new CustomError('Calendario già archiviato.', HttpStatus.CONFLICT);
        }

        await CalendarioRepo.update(id, { isArchived: true });

        const updated = await CalendarioRepo.findById(id);
        return updated;
    }

    // Si chiama il service di Richieste e verifica se ci sono richieste approved e di data successiva
    // Nel caso non ci sono richieste che soddisfano i parametri si procede alla cancellazione del calendario
    static async eliminaCalendario(id: string) {
        const calendario = await CalendarioRepo.findById(id);
        if (!calendario) {
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        } 
        // Check sul valore is archived
        if(calendario.isArchived) {
            throw new CustomError(
            'Il calendario è archiviato e non può essere eliminato.', HttpStatus.CONFLICT );
        }
        
        const richiesteAttive = await RichiestaService.esistonoRichiesteAttive(id);
        if (richiesteAttive) {
            throw new CustomError(
                'Impossibile eliminare: ci sono prenotazioni attive rispetto alla data odierna.', HttpStatus.CONFLICT
            );
        }
        
        await CalendarioRepo.delete(id);

        return { message: 'Calendario eliminato con successo.' };
    }
}