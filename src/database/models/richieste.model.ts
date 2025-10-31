import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Richiesta } from '@/interfaces/richiesta.interfaces';

export type RichiestaCreationAttributes = Optional<
    Richiesta,
    'id' | 'stato' | 'tokenSpesi'
    >;

export class RichiestaModel 
    extends Model<Richiesta, RichiestaCreationAttributes>
    implements Richiesta
{
    public id!: string;
    public titolo!: string;
    public motivazione!: string;
    public dataInizio!: Date;
    public dataFine!: Date;
    public stato!: 'pending' | 'invalid' | 'approved' | 'rejected';
    public tokenSpesi!: number;
    public calendarioId!: string;
    public userId!: string;
    public readonly created_at!: string;
    public readonly updated_at!: string;
}

export default function(sequelize : Sequelize): typeof RichiestaModel {
    RichiestaModel.init(
        {
           id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            titolo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            motivazione: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            dataInizio: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dataFine: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            stato: {
                type: DataTypes.ENUM('pending', 'invalid', 'approved', 'rejected'),
                defaultValue: 'pending',
            },
            tokenSpesi: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            calendarioId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE, 
        },
        {
            tableName: 'richieste',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );
    return RichiestaModel;
}