import { User } from '@/interfaces/user.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Questo type garantisce che id e username siano opzionali quando si crea un nuovo user
// questo perché verranno generati automaticamente quando è creato un nuovo utente
export type UserCreationAttributes = Optional<
    User,
    'id' | 'username' 
>;

// Extends comunica a sequelize quale type il model dovrebbe usare
// Implements l'interfaccia user in modo che il model segue la struttura di User
// created_at e updated_at possono essere undefined
// ci sono le ultime due proprietà readonly perché sequelize li gestisce automaticamente
export class UserModel
    extends Model<User, UserCreationAttributes>
    implements User
{
    public id!: string;
    public username!: string;
    public role!: string;
    public email!: string;
    public tokenDisponibili!: number;
    public created_at: string | undefined;
    public updated_at: string | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
// id è autogenerato usando UUID, username e role non può essere null
// nome tabella è tableName, connette il model all'istanza di sequelize
// timestaps true, garantisce che sequelize gestisce automaticamente i campi created_at e updated_at 
export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            username: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            role: {
                allowNull: false,
                type: DataTypes.STRING(255),
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING(255),
            },
            tokenDisponibili: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 100, // 💰 ad esempio: 100 token iniziali
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'users',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    return UserModel;
}
