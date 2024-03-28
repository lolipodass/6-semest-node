import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database.ts';

export interface PizzaAttributes {
    id?: number;
    name: string;
    calories?: number;
    description?: string;
}

export interface PizzaCreationAttributes extends Optional<PizzaAttributes, 'id'> { }

class Pizza extends Model<PizzaAttributes, PizzaCreationAttributes> implements PizzaAttributes {
    public id!: number;
    public name!: string;
    public calories!: number;
    public description!: string
}

Pizza.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    calories: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    description: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    tableName: 'pizzas',
    sequelize,
});

export default Pizza;