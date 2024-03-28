import { Request, Response } from "express";
import * as PizzaService from "../services/Pizzas_service.ts";
import { handleError } from "../utils/errorHandler.ts";

// GET api/pizzas
export async function getPizzas(req: Request, res: Response) {
    try {
        let pizzas;
        const calories = req.query.calories as string;

        if (calories) {
            let [operator, value] = calories.split(' ');
            operator = operator == "gt" ? ">" : "<";
            pizzas = await PizzaService.GetByCalories(parseInt(value), operator as "<" | ">");
        } else {
            pizzas = await PizzaService.GetAll();
        }

        res.json(pizzas);
    } catch (error: unknown) {
        handleError(error, res);
    }
}

// GET api/pizzas/id
export async function GetPizzaById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) { throw new Error('ID is required'); }

        const pizza = await PizzaService.GetById(id);
        res.json(pizza);

    } catch (error: unknown) {
        handleError(error, res);
    }
}

// POST api/pizzas
export async function createPizza(req: Request, res: Response) {
    try {
        const pizzaData = req.body;
        if (!pizzaData) {
            throw new Error('Pizza data is required');
        }
        if ('id' in pizzaData) {
            delete pizzaData.id;
        }

        const newPizza = await PizzaService.Create(pizzaData);
        res.status(201).json(newPizza);
    } catch (error: unknown) {
        handleError(error, res);
    }
}

// PUT api/pizzas
export async function updatePizzaById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            throw new Error('Invalid ID');
        }

        const updateData = req.body;
        if (!updateData) {
            throw new Error('Update data is required');
        }

        const existingPizza = await PizzaService.GetById(id);
        if (!existingPizza) {
            const newPizza = await PizzaService.Create(updateData);
            res.status(201).json(newPizza);
        } else {
            const updatedPizza = await PizzaService.Update(id, updateData);
            res.status(200).json(updatedPizza);
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

// DELETE api/pizzas
export async function deletePizzaById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            throw new Error('Invalid ID');
        }

        const result = await PizzaService.Delete(id);
        if (result) {
            res.status(200).json({ message: 'Pizza deleted successfully' });
        } else {
            throw new Error('Failed to delete pizza');
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}

export async function updateFatPizzas(req: Request, res: Response) {
    try {
        await PizzaService.UpdateFat();
        res.status(200).json({ message: 'Pizzas Fat' });
    } catch (error: unknown) {
        handleError(error, res);
    }
}