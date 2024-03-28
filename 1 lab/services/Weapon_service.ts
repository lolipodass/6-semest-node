import { Op } from "sequelize";
import Weapon, { WeaponAttributes } from "../models/Weapon.ts";

async function GetAllWeapons(): Promise<Array<WeaponAttributes>> {
    const weapons = await Weapon.findAll();
    return weapons.map(weapon => weapon.toJSON());
}

async function GetWeaponById(id: number): Promise<WeaponAttributes> {
    if (!Number.isInteger(id)) throw new Error('Invalid ID');

    const weapon = await Weapon.findByPk(id);

    if (!weapon) throw new Error('Weapon not found');

    return weapon.toJSON();
}

async function GetWeaponsByDps(n: number, comparison: '>' | '<'): Promise<Array<WeaponAttributes>> {
    if (!Number.isFinite(n)) throw new Error('Invalid DPS value');

    const operator = comparison === '>' ? Op.gt : Op.lt;

    const weapons = await Weapon.findAll({
        where: {
            damage: {
                [operator]: n
            }
        }
    });

    return weapons.map(weapon => weapon.toJSON());
}

async function CreateWeapon(weaponData: WeaponAttributes): Promise<WeaponAttributes> {
    validateWeaponData(weaponData);

    const newWeapon = await Weapon.create(weaponData);

    return newWeapon.toJSON();
}

async function UpdateWeaponById(id: number, updateData: Partial<WeaponAttributes>): Promise<WeaponAttributes> {
    if (!Number.isInteger(id)) { throw new Error('Invalid ID'); }

    validateWeaponData(updateData);

    const weapon = await Weapon.findByPk(id);
    if (!weapon) {
        throw new Error('Weapon not found');
    }

    const updatedWeapon = await weapon.update(updateData);

    return updatedWeapon.toJSON();
}

async function DeleteWeaponById(id: number): Promise<boolean> {
    if (!Number.isInteger(id)) {
        throw new Error('Invalid ID');
    }

    const weapon = await Weapon.findByPk(id);
    if (!weapon) {
        throw new Error('Weapon not found');
    }

    await weapon.destroy();

    return true;
}

function validateWeaponData(weaponData: Partial<WeaponAttributes>) {
    if (weaponData.name === undefined) throw new Error('Name is a required field');

    if (weaponData.damage === undefined) throw new Error('Damage is a required field');

    if (weaponData.damage > 500) throw new Error('DPS cannot be more than 500');
}






export {
    GetAllWeapons as GetAll,
    GetWeaponById as GetById,
    GetWeaponsByDps as GetByDps,
    CreateWeapon as Create,
    UpdateWeaponById as UpdateById,
    DeleteWeaponById as Delete
};