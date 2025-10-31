import { DB } from '@/database';
import { Risorsa } from '@/interfaces/risorsa.interfaces';

const RisorsaRepo = {
    findByName: async (name: string): Promise<Risorsa | null> => {
        return await DB.Risorsa.findOne({ where: { name } });
    },
    
    findAll: async (): Promise<Risorsa[]> => {
        return await DB.Risorsa.findAll();
    },

    findById: async (id: string): Promise<Risorsa | null> => {
        return await DB.Risorsa.findByPk(id);
    },

    createRisorsa: async (risorsaData: Risorsa): Promise<Risorsa> => {
        return await DB.Risorsa.create(risorsaData);
    },

    updateRisorsa: async (id: string, risorsaData: Partial<Risorsa>): Promise<[number, Risorsa[]]> => {
        return await DB.Risorsa.update(risorsaData, { where: { id }, returning: true });
    },

    deleteRisorsa: async (id: string): Promise<number> => {
        return await DB.Risorsa.destroy({ where: { id } });
    },
};

export default RisorsaRepo;