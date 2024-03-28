import { Request, Response } from "express";
import * as WeaponService from "../services/Weapon_service.ts";
import { handleError } from "../utils/errorHandler.ts";

//#GET api/weapons and GET	api/weapons?dps=gt n
//#                         api/weapons?dps=lt n
export async function getWeapons(req: Request, res: Response) {
    try {
        let weapons;
        const dps = req.query.dps as string;

        if (dps) {
            let [operator, value] = dps.split(' ');
            operator = operator == "gt" ? ">" : "<";
            weapons = await WeaponService.GetByDps(parseInt(value), operator as "<" | ">");
        } else {
            weapons = await WeaponService.GetAll();
        }

        res.json(weapons);
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#GET api/weapons/id
export async function getWeaponById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) { throw new Error('ID is required'); }

        const weapon = await WeaponService.GetById(id);
        res.json(weapon);

    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#POST api/weapons
export async function createWeapon(req: Request, res: Response) {
    try {
        const weaponData = req.body;
        if (!weaponData) {
            throw new Error('Weapon data is required');
        }

        const newWeapon = await WeaponService.Create(weaponData);
        res.status(201).json(newWeapon);
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#PUT api/weapons
export async function updateWeapon(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            throw new Error('Invalid ID');
        }

        const updateData = req.body;
        if (!updateData) {
            throw new Error('Update data is required');
        }

        const updatedWeapon = await WeaponService.UpdateById(id, updateData);
        res.status(200).json(updatedWeapon);
    } catch (error: unknown) {
        handleError(error, res);
    }
}

//#DELETE api/weapons
export async function deleteWeapon(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            throw new Error('Invalid ID');
        }

        const updateData = await WeaponService.GetById(id);
        const result = await WeaponService.Delete(id);
        if (result) {
            res.status(200).json(updateData);
        } else {
            throw new Error('Failed to delete weapon');
        }
    } catch (error: unknown) {
        handleError(error, res);
    }
}