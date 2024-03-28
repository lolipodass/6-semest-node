import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database.ts';
import Pizza from './pizzas.ts';
import Weapon from './Weapon.ts';


export interface TurtleAttributes {
    id?: number;
    name: string;
    color: string;
    weaponId?: number | null;
    favoritePizzaId?: number | null;
    secondFavoritePizzaId?: number | null;
    favoritePizza?: Pizza | null;
    secondFavoritePizza?: Pizza | null;
    Weapon?: Weapon | null;
    image?: string | null;
}

export interface TurtleCreationAttributes extends Optional<TurtleAttributes, 'id'> { }

class Turtle extends Model<TurtleAttributes, TurtleCreationAttributes> implements TurtleAttributes {
    public id!: number;
    public name!: string;
    public color!: string;
    public weaponId?: number;
    public favoritePizzaId?: number;
    public secondFavoritePizzaId?: number;
    public image?: string;
}

Turtle.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    color: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    weaponId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Weapons',
            key: 'id',
        },
    },
    favoritePizzaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Pizzas',
            key: 'id',
        },
    },
    secondFavoritePizzaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Pizzas',
            key: 'id',
        },
    },
    image: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    tableName: 'turtles',
    sequelize,
});




Turtle.belongsTo(Pizza, {
    foreignKey: 'favoritePizzaId',
    as: 'favoritePizza',
});

Turtle.belongsTo(Pizza, {
    foreignKey: 'secondFavoritePizzaId',
    as: 'secondFavoritePizza',
});

Turtle.belongsTo(Weapon, {
    foreignKey: 'weaponId',
    as: 'Weapon'
});


export default Turtle;