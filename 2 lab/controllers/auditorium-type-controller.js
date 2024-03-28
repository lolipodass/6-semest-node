import auditoriumTypeService from "../services/auditorium-type-service.js";
import { checkSchema } from "express-validator";

const schema = {
    auditorium_type: { notEmpty: true, isString: true },
    auditorium_typename: { notEmpty: true, isString: true }
};

class AuditoriumTypeController {
    static async getAuditoriumTypes(req, res) {
        const auditoriumTypes = await auditoriumTypeService.read(req, res);
        res.json(auditoriumTypes);
    }

    static async getAuditoriums(req, res) {
        const auditoriums = await auditoriumTypeService.auditoriums(req, res);
        res.json(auditoriums);
    }

    static async createAuditoriumType(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!AuditoriumTypeController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: AuditoriumTypeController.#getSchemaError(jsonValidation)});
            return;
        }

        const auditoriumType = await auditoriumTypeService.create(req, res);
        res.json(auditoriumType);
    }

    static async updateAuditoriumType(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!AuditoriumTypeController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: AuditoriumTypeController.#getSchemaError(jsonValidation)});
            return;
        }

        const auditoriumType = await auditoriumTypeService.update(req, res);
        res.json(auditoriumType);
    }

    static async deleteAuditoriumType(req, res) {
        const auditoriumType = await auditoriumTypeService.delete(req, res);
        res.json(auditoriumType);
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default AuditoriumTypeController;