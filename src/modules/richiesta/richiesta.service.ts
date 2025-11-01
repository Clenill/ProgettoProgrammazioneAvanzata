import { CustomError } from '@/utils/custom-error';
import RichiestaRepo from './richiesta.repo';
import { validateRichiesta, validateRichiestaDecision } from './richiesta.validator';
import { Richiesta } from '@/interfaces/richiesta.interfaces';
import { modificaUserTokensService } from '../user/user.service';
import { CalendarioService } from '../calendario/calendario.service';
import { Op } from 'sequelize';
import { validateDisponibilitaCalendario } from '../calendario/calendario.validator';
import CalendarioRepo from '../calendario/calendario.repo';
import { HttpStatus } from '@/utils/http-status';

export class RichiestaService {
    static async creaRichiesta(data: Richiesta, user: any) {
        // Necessario per modificaUserTokensService
        if (!user.userId) {
            throw new CustomError('ID utente mancante', HttpStatus.BAD_REQUEST);
        }
        const richiestaData = { ...data, userId: user.userId};
        const { error } = validateRichiesta(richiestaData);
        if (error) {
            throw new CustomError(error.details[0].message, HttpStatus.BAD_REQUEST);
        } 

        const calendario = await CalendarioService.calendarioById(data.calendarioId);
        if (!calendario) {
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        }

        //Validazione slot disponibile
        const slotDisponibile = await this.verificaDisponibilitaRange({
            calendarioId: data.calendarioId,
            dataInizio: data.dataInizio,
            dataFine: data.dataFine
        });

        if(!slotDisponibile) {
            throw new CustomError('Lo slot temporale richiesto non è disponibile.', HttpStatus.CONFLICT);
        }

        // Calcolo ore e costo
        const ore = (new Date(data.dataFine).getTime() - new Date(data.dataInizio).getTime()) / (1000 * 60 * 60);
        if (ore <= 0) {
            throw new CustomError('Intervallo non valido.', HttpStatus.BAD_REQUEST);
        } 

        const costoTotale = Math.floor(ore * calendario.tokenCostoOrario);

        // check token utente maggiori costo richiesta
        if (user.tokenDisponibili < costoTotale) {
            return await RichiestaRepo.create({
                ...richiestaData,
                stato: 'invalid',
                tokenSpesi: 0,
            });
        }

        // scala i token e crea la richiesta pending
        await modificaUserTokensService(user.userId, -costoTotale);

        // Creazione della Richiesta
        return await RichiestaRepo.create({
            ...richiestaData,
            stato: 'pending',
            tokenSpesi: costoTotale,
        });
    }

    static async tutteLeRichieste(filters?: any) {
        const where: any = {};
        // Filtra per stato
        if (filters?.stato) {
            where.stato = filters.stato;
        }
        // Filtra per data 
        if(filters?.dataInizio || filters?.dataFine) {
            where.created_at = {};
            // Op.gte e Op.lte per gestire correttamente gli intervalli di data
            if (filters.dataInizio) {
                where.created_at[Op.gte] = new Date(filters.dataInizio);
            }
            if (filters.dataFine) {
                where.created_at[Op.lte] = new Date(filters.dataFine);
            }
        }

        return await RichiestaRepo.findAll(where);
    }

    static async aggiornaStatoRichiestaPending(id: string, decision: any ) {
        // Validazione payload
        const { error } = validateRichiestaDecision(decision);
        if (error) {
            throw new CustomError(error.details[0].message, HttpStatus.BAD_REQUEST);
        }
        // Recupera la richiesta
        const richiesta = await RichiestaRepo.findById(id);
        if (!richiesta) {
            throw new CustomError('Richiesta non trovata.', HttpStatus.NOT_FOUND);
        }
        // Controllo sullo stato della richiesta === 'pending'
        if(richiesta.stato !== 'pending') {
            throw new CustomError(
                'Solo le richieste in stato pending possono essere modificate.', HttpStatus.BAD_REQUEST
            );
        }
        // Dati da aggiornare
        const updateData: any = {
            stato: decision.stato
        };
        //Se la richiesta è rigettata allora si salva anche la motivazione
        if(decision.stato === 'rejected') {
            updateData.motivazione = decision.motivazione;
        }
        // Aggiornamento richiesta
        await RichiestaRepo.update(id, updateData);
        const richiestaModificata = await RichiestaRepo.findById(id);
        return richiestaModificata;
    }

    static async esistonoRichiesteAttive(calendarioId: string): Promise<boolean> {
        const count = await RichiestaRepo.countActiveByCalendario(calendarioId);
        return count > 0;
    }

    static async verificaDisponibilitaRange(filters: any) {
        const { error } = validateDisponibilitaCalendario(filters);
        if (error) {
            throw new CustomError(error.details[0].message, HttpStatus.BAD_REQUEST);
        }

        const { calendarioId, dataInizio, dataFine } = filters;

        const start = new Date(dataInizio);
        const end = new Date(dataFine);

        const richiesteSovrapposte = 
            await RichiestaRepo.sovrapposizioniOraDataCalendarioId(calendarioId, start, end);

        return richiesteSovrapposte.length === 0;
    }

    static async cancellaRichiesta(id: string, user: any) {
        const richiesta = await RichiestaRepo.findById(id);
        if(!richiesta) {
            throw new CustomError('Richiesta non trovata.', HttpStatus.NOT_FOUND);
        }

        if(richiesta.userId !== user.userId) {
            throw new CustomError('Non puoi cancellare richieste di altri utenti.', HttpStatus.FORBIDDEN);
        }

        const calendario = await CalendarioService.calendarioById(richiesta.calendarioId);
        if (!calendario) {
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        }

        const nowData = new Date();
        const inizioDataRichiesta = new Date(richiesta.dataInizio);
        const fineDataRichiesta = new Date(richiesta.dataFine);

        const costoOrarioToken = calendario.tokenCostoOrario;
        const oreTotali = (fineDataRichiesta.getTime() - inizioDataRichiesta.getTime()) / (1000 * 60 * 60);
        const oreUsate = Math.max((nowData.getTime() - inizioDataRichiesta.getTime()) / (1000 * 60 * 60), 0);
        const oreNonUsate = Math.max(oreTotali - oreUsate, 0);

        let pena = 0;

        // Se tra inizio e fine
        if(nowData >= inizioDataRichiesta && nowData < fineDataRichiesta) {
            pena = 2;
        } else if ( nowData < inizioDataRichiesta) {
            pena = 1;
        }

        // Rimborso token non usati
        const rimborso = Math.floor(oreNonUsate * costoOrarioToken);

        const tokenDaRestituire = Math.max(rimborso - pena, 0);

        // Restituzione token
        await modificaUserTokensService(richiesta.userId, tokenDaRestituire);

        // Elimina richiesta
        await RichiestaRepo.delete(id);

        return {
            idRichiesta: richiesta.id,
            tokenRestituiti: tokenDaRestituire
        };
    }

    static async tutteLeRichiesteFiltrate(filters: any) {
        const where: any = {};

        // Se presenti si vanno ad aggiungere i filtri alla query che verrà fatta nel repository
        if(filters.calendarioId) {
            where.calendarioId = filters.calendarioId;
        }
        if(filters.stato) {
            where.stato = filters.stato;
        }
        if(filters.dataInizio || filters.dataFine) {
            where.dataInizio = {};

            if (filters.dataInizio) {
                where.dataInizio[Op.gte] = new Date(filters.dataInizio);
            }

            if (filters.dataFine) {
                where.dataInizio[Op.lte] = new Date(filters.dataFine);
            }
        }

        return await RichiestaRepo.filtraConParametriOpzionali(where);
    }

    static async richiestePerCalendario(calendarioId: string) {
        const calendario = await CalendarioRepo.findById(calendarioId);
            if (!calendario) {
            throw new CustomError('Calendario non trovato.', HttpStatus.NOT_FOUND);
        }
        return await RichiestaRepo.findByCalendarioId(calendarioId);
    }
}
