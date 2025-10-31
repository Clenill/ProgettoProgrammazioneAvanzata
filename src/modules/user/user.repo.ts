import { DB } from '@/database';
import { User } from '@/interfaces/user.interfaces';

export const repo = {
    getUserProfile: async (
        userId: string | undefined,
    ): Promise<User | null> => {
        return await DB.Users.findOne({ where: { id: userId } });
    },

    modificaUserTokens: async (
        userId: string, newTokenCount: number
    ): Promise<User | null> => {
        const user = await DB.Users.findByPk(userId);
        if(!user) {
            return null;
        }

        user.tokenDisponibili = newTokenCount;
        await user.save();
        return user;
    },

    addToken: async (userId: string, token: number) => {
        return await DB.Users.increment(
            {tokenDisponibili: token},
            { where: { id: userId } }
        );
    },
};
