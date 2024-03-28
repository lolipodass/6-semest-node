import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database.ts';

export interface WeaponAttributes {
    id?: number;
    name: string;
    damage?: number;
}

export interface WeaponCreationAttributes extends Optional<WeaponAttributes, 'id'> { }

class Weapon extends Model<WeaponAttributes, WeaponCreationAttributes> implements WeaponAttributes {
    public id!: number;
    public name!: string;
    public damage!: number;
}

Weapon.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    damage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'weapons',
    sequelize,
});

export default Weapon;