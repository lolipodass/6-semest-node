import Turtle, { TurtleAttributes } from "../models/turtles.ts";
import Pizza from "../models/pizzas.ts";
import Weapon from "../models/Weapon.ts";

interface TurtleAttributesWithName extends TurtleAttributes {
    favoritePizzaName?: string;
}
async function GetAll(): Promise<Array<TurtleAttributes>> {
    const turtles = await Turtle.findAll();
    return turtles.map(turtle => turtle.toJSON());
};

async function GetById(id: number): Promise<TurtleAttributes | null> {
    if (!Number.isInteger(id)) throw new Error('Invalid ID');

    const turtle = await Turtle.findOne({ where: { id } });

    if (!turtle) { return null; }
    return turtle.toJSON();
}


async function GetByFavoritePizza(pizzaName: string): Promise<Array<TurtleAttributesWithName>> {
    const turtles = await Turtle.findAll({
        include: {
            model: Pizza,
            required: true,
            as: 'favoritePizza',
            where: { name: pizzaName },
            attributes: ['name']
        },
    });

    return turtles.map(turtle => {
        let { favoritePizza, ...restOfTurtleDataValues } = turtle.toJSON();
        return {
            ...restOfTurtleDataValues,
            favoritePizzaName: favoritePizza?.name
        };
    }
    )
}

async function CreateTurtle(turtleData: TurtleAttributes): Promise<TurtleAttributes> {
    ValidateTurtle(turtleData);

    console.log(turtleData);
    const newTurtle = await Turtle.create(turtleData);

    return newTurtle.toJSON();
}

async function UpdateTurtleById(id: number, updateData: Partial<TurtleAttributes>): Promise<TurtleAttributes> {
    if (!Number.isInteger(id)) throw new Error('Invalid ID');

    const turtle = await Turtle.findByPk(id);

    if (!turtle) throw new Error('Turtle not found');

    await turtle.update(updateData);

    return turtle.toJSON();
}

async function DeleteTurtleById(id: number): Promise<boolean> {

    if (!Number.isInteger(id)) throw new Error('Invalid ID');

    const turtle = await Turtle.findByPk(id);

    if (!turtle) throw new Error('Turtle not found');

    try {
        await turtle.destroy();
        return true;
    }
    catch { return false }

}

/**
 * Manages the favorite pizzas for a turtle.
 * 
 * This function allows updating the favorite pizzas of a turtle by their IDs. It supports setting one or two favorite pizzas.
 * If a pizza ID is provided as `null`, it will clear the corresponding favorite pizza.
 * 
 * @param turtleId - The ID of the turtle whose favorite pizzas are to be managed. Must be an integer.
 * @param firstPizzaId - The ID of the first favorite pizza. Can be a number (ID of the pizza), `null` to clear, or `undefined` to leave unchanged.
 * @param secondPizzaId - The ID of the second favorite pizza. Can be a number (ID of the pizza), `null` to clear, or `undefined` to leave unchanged.
 * 
 * @returns A Promise that resolves to `true` if the update is successful, or `false` if the update fails.
 * 
 * @throws Will throw an error if the `turtleId` is not an integer, if the turtle is not found, if a pizza is not found, or if there is an error during the update process.
 * 
 * @example
 * // Set the first favorite pizza to ID 1 and clear the second favorite pizza
 * manageFavoritePizzas(1, 1, null)
 *     .then(success => console.log(success ? 'Update successful' : 'Update failed'))
 *     .catch(error => console.error(error));
 */
async function manageFavoritePizzas(turtleId: number, firstPizzaId?: number | null, secondPizzaId?: number | null): Promise<boolean> {
    if (!Number.isInteger(turtleId)) {
        throw new Error('Invalid turtle ID');
    }

    const turtle = await Turtle.findByPk(turtleId);

    if (!turtle) throw new Error('Turtle not found');

    let updateData: { favoritePizzaId?: number | null, secondFavoritePizzaId?: number | null } = {};

    if (firstPizzaId !== undefined) {
        if (typeof firstPizzaId === 'number') {
            const firstPizza = await Pizza.findByPk(firstPizzaId);
            if (!firstPizza) throw new Error('First favorite pizza not found');
            updateData.favoritePizzaId = firstPizzaId;
        } else if (firstPizzaId === null) {
            updateData.favoritePizzaId = null;
        }
    }

    if (secondPizzaId !== undefined) {
        if (typeof secondPizzaId === 'number') {
            const secondPizza = await Pizza.findByPk(secondPizzaId);
            if (!secondPizza) throw new Error('Second favorite pizza not found');
            updateData.secondFavoritePizzaId = secondPizzaId;
        } else if (secondPizzaId === null) {
            updateData.secondFavoritePizzaId = null;
        }
    }

    try {
        await turtle.update(updateData);
        return true;
    } catch {
        return false;
    }
}

/**
 * Manages the weapon for a turtle.
 * 
 * This function allows updating the weapon of a turtle by its ID. It supports setting a weapon or clearing the weapon.
 * If a weapon ID is provided as `null`, it will clear the weapon.
 * 
 * @param turtleId - The ID of the turtle whose weapon is to be managed. Must be an integer.
 * @param weaponId - The ID of the weapon. Can be a number (ID of the weapon), `null` to clear.
 * 
 * @returns A Promise that resolves to `true` if the update is successful, or `false` if the update fails.
 * 
 * @throws Will throw an error if the `turtleId` is not an integer, if the turtle is not found, if a weapon is not found, or if there is an error during the update process.
 * 
 * @example
 * // Set the weapon to ID 1
 * manageWeapon(1, 1)
 *     .then(success => console.log(success ? 'Update successful' : 'Update failed'))
 *     .catch(error => console.error(error));
 * // Clear the weapon
 * manageWeapon(1, null)
 *     .then(success => console.log(success ? 'Update successful' : 'Update failed'))
 *     .catch(error => console.error(error));
 */
async function ManageWeapon(turtleId: number, weaponId: number | null): Promise<boolean> {
    if (!Number.isInteger(turtleId)) {
        throw new Error('Invalid turtle ID');
    }

    const turtle = await Turtle.findByPk(turtleId);

    if (!turtle) throw new Error('Turtle not found');

    if (weaponId !== null) {
        if (typeof weaponId === 'number') {
            const weapon = await Weapon.findByPk(weaponId);
            if (!weapon) throw new Error('Weapon not found');
        }
    }

    try {
        await turtle.update({
            weaponId: weaponId === null ? null : weaponId,
        });
        return true;
    } catch {
        return false;
    }
}

function ValidateTurtle(turtleData: Partial<TurtleAttributes>) {
    if (!turtleData.name) { throw new Error('Name are required field'); }
    if (!turtleData.color) { throw new Error('color are required field'); }
}

export {
    GetAll as GetAllTurtles, GetById as GetTurtleById, GetByFavoritePizza as GetTurtleByFavoritePizza,
    CreateTurtle,
    UpdateTurtleById,
    manageFavoritePizzas,
    DeleteTurtleById,
    ManageWeapon
};
