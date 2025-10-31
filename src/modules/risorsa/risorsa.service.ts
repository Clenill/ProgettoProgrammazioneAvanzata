import { CustomError } from '@/utils/custom-error';
import RisorsaRepo from './risorsa.repo';
import { Risorsa } from '@/interfaces/risorsa.interfaces';
import { validateRisorsa } from './risorsa.validator';

export class RisorsaService {
    static async creaRisorsa(data: Risorsa) {
        const { error } = validateRisorsa(data);
        if(error) {
        throw new CustomError(error.details[0].message, 400);
    }
    // Normalizza il nome in formato underscore
    const formattedName = data.name.trim().toLowerCase().replaceAll(/\s+/g, '_');

    const existing = await RisorsaRepo.findByName(formattedName);
    if(existing) {
        throw new CustomError(`La risorsa "${formattedName}" esiste già.`, 409);
    }

    const newRisorsa = await RisorsaRepo.createRisorsa({ name: formattedName });
    return newRisorsa;
    }
    
    static async tutteLeRisorse() {
        return await RisorsaRepo.findAll();
    }

    static async risorsaById(id: string) {
        const risorsa = await RisorsaRepo.findById(id);
        if(!risorsa) {
            throw new CustomError('Risorsa non trovata.', 404);
        }
        return risorsa;
    }

    static async modificaRisorsa(id: string, data: Partial<Risorsa>) {
        if(data.name) {
            data.name = data.name.trim().toLowerCase().replaceAll(/\s+/g, '_');
        }

        const risorsa = await RisorsaRepo.findById(id);
        if (!risorsa) {
            throw new CustomError('Risorsa non trovata.', 404);
        }

        await RisorsaRepo.updateRisorsa(id, data);
        return await RisorsaRepo.findById(id);
    }

    static async deleteRisorsa(id: string) {
        const deleted = await RisorsaRepo.deleteRisorsa(id);
        if (!deleted) {
            throw new CustomError('Risorsa non trovata o già eliminata.', 404);
        }
        return { message: 'Risorsa eliminata con successo.' };
    }
}