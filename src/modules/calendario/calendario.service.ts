import { CustomError } from '@/utils/custom-error';
import CalendarioRepo from './calendario.repo';
import { Calendario } from '@/interfaces/calendario.interfaces';
import { validateCalendario, validateDisponibilitaCalendario } from './calendario.validator';
import RisorsaRepo from '../risorsa/risorsa.repo';
import { RichiestaService } from '../richiesta/richiesta.service';
import { HttpStatus } from '@/utils/http-status';

export class CalendarioService {
    /**
     * Crea un nuovo calendario associato a una risorsa.
     * - Valida i dati di input (risorsaId, tokenCostoOrario)
     * - Verifica che la risorsa esista
     * - Impedisce la creazione di un secondo calendario per la stessa risorsa
     * - Registra un nuovo calendario attivo (isArchived = false)
     * 
     * @throws CustomError 400 se i dati non passano la validazione
     * @throws CustomError 404 se la risorsa non esiste
     * @throws CustomError 409 se esiste già un calendario per la risorsa
     */
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

    /**
     * Verifica se uno slot temporale è disponibile per un dato calendario.
     * - Valida i parametri (calendarioId, dataInizio, dataFine)
     * - Controlla che il calendario esista
     * - Delegata al RichiestaService per verificarne le sovrapposizioni
     * 
     * @returns boolean → true se disponibile, false altrimenti
     * 
     * @throws CustomError 400 se validazione fallisce
     * @throws CustomError 404 se il calendario non esiste
     */
    static async disponibilePerIdeDataInizioFine(filters: any){
        // Si validano i campi
        const { error } = validateDisponibilitaCalendario(filters);
        if (error) {
            throw new CustomError(error.details[0].message, HttpStatus.BAD_REQUEST);
        }
        // Se calendario esiste ok altimenti errore
        const calendario = await this.calendarioById(filters.calendarioId);
        if (!calendario) {
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        }
        const disponibile = await RichiestaService.verificaDisponibilitaRange(filters);

        return disponibile; // true o false
    }

    static async recuperaCalendari() {
        return await CalendarioRepo.findAll();
    }

    /**
     * Recupera un calendario tramite il suo id.
     * - Se non esiste, solleva errore personalizzato.
     * 
     * @throws CustomError 404 se il calendario non è trovato
     */
    static async calendarioById(id: string) {
        const calendario = await CalendarioRepo.findById(id);
        if (!calendario) {
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        } 
        return calendario;
    }

     /**
     * Archivia un calendario.
     * - Verifica che il calendario esista
     * - Impedisce di archiviare due volte
     * - Segna isArchived = true
     * 
     * @throws CustomError 404 se il calendario non esiste
     * @throws CustomError 409 se è già archiviato
     */
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

    /**
     * Elimina un calendario.
     * - Verifica che il calendario esista
     * - Impedisce l'eliminazione se è archiviato
     * - Controlla tramite RichiestaService se esistono richieste attive
     * - Se è tutto ok, elimina definitivamente il calendario
     * 
     * @throws CustomError 404 se il calendario non esiste
     * @throws CustomError 409 se è archiviato
     * @throws CustomError 409 se ci sono richieste attive future
     */
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