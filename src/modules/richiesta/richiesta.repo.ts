import { DB } from '@/database';
import { Richiesta } from '@/interfaces/richiesta.interfaces';
import { Op } from 'sequelize';

const RichiestaRepo = {
    create: async (data: Richiesta): Promise<Richiesta> => {// metodo definito come arrow function asincrona
        return await DB.Richiesta.create(data); // Chiamata a sequelize: crea una nuova richiesta
    },

    findAll: async (filters: any = {}): Promise<Richiesta[]> => {// default parameter, se non si passa nulla filters sarà oggetto vuoto
        return await DB.Richiesta.findAll({ 
            where: filters ,
            attributes: ['id', 'stato'],// si selezionano solo queste colonne per la risposta
        });
    },

    findById: async (id: string): Promise<Richiesta | null> => {
        return await DB.Richiesta.findByPk(id);
    },

    update: async (id: string, data: Partial<Richiesta>) => {
        return await DB.Richiesta.update(data, { where: { id } });
    },

    delete: async (id: string) => {
        return await DB.Richiesta.destroy({ where: { id } });
    },

    filtraConParametriOpzionali: async (where: any): Promise<Richiesta[]> => {
        return await DB.Richiesta.findAll({ where });
    },

    sovrapposizioniOraDataCalendarioId: async (calendarioId: string, start: Date, end: Date): Promise<Richiesta[]> => {
        return await DB.Richiesta.findAll({
            where: {
                calendarioId,
                stato: { [Op.in]: ['approved', 'pending'] },
                dataInizio: { [Op.lt]: end },// data inizio minore di end
                dataFine: { [Op.gt]: start } // data fine maggiore di start
            }
        });
    },

    countActiveByCalendario: async(calendarioId: string): Promise<number> => {
        const now = new Date(Date.now());
        return await DB.Richiesta.count({
            where: {
                calendarioId,
                stato: { [Op.in]: ['approved', 'pending'] },// check se il valore è contenuto nell'array
                 [Op.or]: [
                { dataInizio: { [Op.gt]: now } },  // richieste future. Op.gt greater than
                { dataFine:   { [Op.gt]: now } },  // richieste in corso
            ]
            }
        });
    },

    findByCalendarioId: async(calendarioId: string): Promise<Richiesta[]> => {
        return await DB.Richiesta.findAll({
            where: { calendarioId }
        });
    },
};

export default RichiestaRepo;
