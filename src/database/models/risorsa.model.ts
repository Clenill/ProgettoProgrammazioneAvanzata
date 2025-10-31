import { Risorsa } from "@/interfaces/risorsa.interfaces";
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export type RisorsaCreationAttributes = Optional<
    Risorsa,
    'id' 
>;

export class RisorsaModel 
    extends Model<Risorsa, RisorsaCreationAttributes>
    implements Risorsa
{
    public id!: string;
    public name!: string;
    public created_at?: string;// Opzionali per rispettare l'interfaccia
    public updated_at?: string;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

export default function(sequelize: Sequelize): typeof RisorsaModel {
    RisorsaModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'risorsa',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );
    return RisorsaModel;
}