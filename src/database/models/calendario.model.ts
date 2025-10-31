import { Calendario } from "@/interfaces/calendario.interfaces";
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type CalendarioCreationAttributes = Optional<
    Calendario,
    'id'
>;

export class CalendarioModel
    extends Model<Calendario, CalendarioCreationAttributes>
    implements Calendario
{
    public id!: string;
    public risorsaId!: string;
    public tokenCostoOrario!: number;
    public created_at?: string;
    public updated_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function(sequelize: Sequelize): typeof CalendarioModel {
    CalendarioModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            risorsaId: {
                allowNull: false,
                type: DataTypes.UUID,
                unique: true,
            },
            tokenCostoOrario: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'calendari',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );
    return CalendarioModel;
};