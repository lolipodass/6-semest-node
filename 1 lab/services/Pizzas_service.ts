import { Op } from "sequelize";
import Pizza, { PizzaAttributes } from "../models/pizzas.ts";
import sequelize from "../database.ts";

async function GetAllPizzas(): Promise<Array<PizzaAttributes>> {
    const pizzas = await Pizza.findAll();
    return pizzas.map(weapon => weapon.toJSON());
}

async function GetPizzaById(id: number): Promise<PizzaAttributes> {
    if (!Number.isInteger(id)) throw new Error('Invalid ID');

    const pizza = await Pizza.findByPk(id);

    if (!pizza) throw new Error('Pizza not found');

    return pizza.toJSON();
}

async function GetPizzasByCalories(m: number, comparison: '>' | '<'): Promise<Array<PizzaAttributes>> {
    if (!Number.isFinite(m)) throw new Error('Invalid caloric value');

    const operator = comparison === '>' ? Op.gt : Op.lt;

    const pizzas = await Pizza.findAll({
        where: {
            calories: {
                [operator]: m
            }
        }
    });

    return pizzas.map(pizza => pizza.toJSON());
}


async function CreatePizza(PizzasData: PizzaAttributes): Promise<PizzaAttributes> {
    validatePizzaData(PizzasData);

    const newWeapon = await Pizza.create(PizzasData);

    return newWeapon.toJSON();
}

async function UpdatePizzaById(id: number, updateData: Partial<PizzaAttributes>): Promise<PizzaAttributes> {
    if (!Number.isInteger(id)) { throw new Error('Invalid ID'); }

    validatePizzaData(updateData);

    const pizza = await Pizza.findByPk(id);
    if (!pizza) {
        throw new Error('Pizza not found');
    }

    const updatedPizza = await pizza.update(updateData);

    return updatedPizza.toJSON();
}

async function DeletePizzaById(id: number): Promise<boolean> {
    if (!Number.isInteger(id)) {
        throw new Error('Invalid ID');
    }

    const pizza = await Pizza.findByPk(id);
    if (!pizza) {
        throw new Error('Weapon not found');
    }

    await pizza.destroy();

    return true;
}

function validatePizzaData(weaponData: Partial<PizzaAttributes>) {
    if (weaponData.name === undefined) throw new Error('Name is a required field');

    if (weaponData.calories === undefined) throw new Error('Calories is a required field');

    if (weaponData.calories > 2000) throw new Error('Calories cannot be more than 2000');
}

async function updateFatPizzas(): Promise<void> {
    await sequelize.transaction(async (t) => {
        const pizzas = await Pizza.findAll({
            where: {
                calories: {
                    [Op.gt]: 1500
                }
            },
            transaction: t
        });

        for (const pizza of pizzas) {
            await pizza.update({
                description: `${pizza.description} SUPER FAT!`
            }, { transaction: t });
        }
    });
}



export {
    GetAllPizzas as GetAll,
    GetPizzaById as GetById,
    GetPizzasByCalories as GetByCalories,
    CreatePizza as Create,
    UpdatePizzaById as Update,
    DeletePizzaById as Delete,
    updateFatPizzas as UpdateFat
};
