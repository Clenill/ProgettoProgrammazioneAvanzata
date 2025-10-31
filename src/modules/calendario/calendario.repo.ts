import { DB } from '@/database';
import { Calendario } from '@/interfaces/calendario.interfaces';

const CalendarioRepo = {
    findById: async (id: string): Promise<Calendario | null> => {
        return await DB.Calendario.findByPk(id);
    },

    findByRisorsa: async (risorsaId: string): Promise<Calendario | null> => {
        return await DB.Calendario.findOne({ where: { risorsaId } });
    },

    findAll: async (): Promise<Calendario[]> => {
        return await DB.Calendario.findAll();
    }, 

    create: async (data: Calendario): Promise<Calendario> => {
        return await DB.Calendario.create(data);
    },

    update: async (id: string, data: Partial<Calendario>) => {
        return await DB.Calendario.update(data, { where: { id } });
    },

    delete: async (id: string) => {
        return await DB.Calendario.destroy({ where: { id } });
    }
};

export default CalendarioRepo;