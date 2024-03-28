import { Request, Response } from "express"
import * as TurtleService from "../services/Turtles_service.ts"
import { handleError } from "../utils/errorHandler.ts";

//#GET api/turtles and api/turtles?favoritePizza=str
export async function GetTurtles(req: Request, res: Response) {
    try {
        let turtles;
        const pizzaName = req.query.favoritePizza as string;

        console.log(pizzaName);
        if (pizzaName) {
            turtles = await TurtleService.GetTurtleByFavoritePizza(pizzaName);
        } else {
            turtles = await TurtleService.GetAllTurtles();
        }

        res.json(turtles);
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#GET api/turtles/id
export async function GetTurtleById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) { throw new Error('ID is required'); }

        const turtle = await TurtleService.GetTurtleById(id);
        res.json(turtle);

    } catch (error: unknown) {
        handleError(error, res);
    }
}


//#POST api/turtles
export async function createTurtle(req: Request, res: Response) {
    try {
        let turtleData = req.body;
        if (!turtleData) {
            throw new Error('Turtle data is required');
        }

        if ('id' in turtleData) {
            delete turtleData.id;
        }

        const newTurtle = await TurtleService.CreateTurtle(turtleData);
        res.status(201).json(newTurtle);
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#PUT api/turtles/:id
export async function updateTurtleById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            throw new Error('Invalid ID');
        }

        const updateData = req.body;
        if (!updateData) {
            throw new Error('Update data is required');
        }

        const existingTurtle = await TurtleService.GetTurtleById(id);
        if (!existingTurtle) {
            const newTurtle = await TurtleService.CreateTurtle(updateData);
            res.status(201).json(newTurtle);
        } else {
            const updatedTurtle = await TurtleService.UpdateTurtleById(id, updateData);
            res.status(200).json(updatedTurtle);
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#PUT api/turtles/favoritePizzaBind
export async function bindFavoritePizza(req: Request, res: Response) {
    try {
        const turtleId = parseInt(req.params.turtleId as string, 10);
        const pizzaId = parseInt(req.params.pizzaId as string, 10);

        if (isNaN(turtleId) || isNaN(pizzaId)) {
            throw new Error('Invalid IDs');
        }

        if (await TurtleService.manageFavoritePizzas(turtleId, pizzaId, undefined)) {
            const updatedTurtle = await TurtleService.GetTurtleById(turtleId);
            console.log(updatedTurtle);
            res.status(200).json(updatedTurtle);

        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#PUT api/turtles/secondFavoritePizzaBind
export async function bindSecondFavoritePizza(req: Request, res: Response) {
    try {
        const turtleId = parseInt(req.params.turtleId as string, 10);
        const pizzaId = parseInt(req.params.pizzaId as string, 10);

        if (isNaN(turtleId) || isNaN(pizzaId)) {
            throw new Error('Invalid IDs');
        }

        if (await TurtleService.manageFavoritePizzas(turtleId, undefined, pizzaId)) {
            const updatedTurtle = await TurtleService.GetTurtleById(turtleId);
            res.status(200).json(updatedTurtle);

        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#PUT api/turtles/weaponBind
export async function bindWeapon(req: Request, res: Response) {
    try {
        const turtleId = parseInt(req.params.turtleId as string, 10);
        const weaponId = parseInt(req.params.weaponId as string, 10);

        if (isNaN(turtleId) || isNaN(weaponId)) {
            throw new Error('Invalid IDs');
        }

        if (await TurtleService.ManageWeapon(turtleId, weaponId)) {
            const updatedTurtle = await TurtleService.GetTurtleById(turtleId);
            res.status(200).json(updatedTurtle);
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#DELETE api/turtles/favoritePizzaUnbind
export async function unbindFavoritePizza(req: Request, res: Response) {
    try {
        const turtleId = parseInt(req.params.turtleId as string, 10);
        if (isNaN(turtleId)) {
            throw new Error('Invalid turtle ID');
        }

        const result = await TurtleService.manageFavoritePizzas(turtleId, null, undefined);
        if (result) {
            res.status(200).json({ message: 'Favorite pizza unbound successfully' });
        } else {
            throw new Error('Failed to unbind favorite pizza');
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#DELETE api/turtles/secondFavoritePizzaUnbind
export async function unbindSecondFavoritePizza(req: Request, res: Response) {
    try {
        const turtleId = parseInt(req.params.turtleId as string, 10);
        if (isNaN(turtleId)) {
            throw new Error('Invalid turtle ID');
        }

        const result = await TurtleService.manageFavoritePizzas(turtleId, undefined, null);
        if (result) {
            res.status(200).json({ message: 'Second favorite pizza unbound successfully' });
        } else {
            throw new Error('Failed to unbind second favorite pizza');
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#DELETE api/turtles/weaponUnbind
export async function unbindWeapon(req: Request, res: Response) {
    try {
        const turtleId = parseInt(req.params.turtleId as string, 10);
        if (isNaN(turtleId)) {
            throw new Error('Invalid turtle ID');
        }

        const result = await TurtleService.ManageWeapon(turtleId, null);
        if (result) {
            res.status(200).json({ message: 'Weapon unbound successfully' });
        } else {
            throw new Error('Failed to unbind weapon');
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}


//#DELETE api/turtles
export async function deleteTurtleById(req: Request, res: Response) {
    try {
        const turtleId = parseInt(req.params.id as string, 10);
        if (isNaN(turtleId)) {
            throw new Error('Invalid ID');
        }

        const deletedTurtle = await TurtleService.GetTurtleById(turtleId)

        const result = await TurtleService.DeleteTurtleById(turtleId);
        if (result) {
            res.status(200).json(deletedTurtle);
        } else {
            throw new Error('Failed to delete turtle');
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}
