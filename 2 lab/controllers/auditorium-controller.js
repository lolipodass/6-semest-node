import auditoriumService from "../services/auditorium-service.js";
import { checkSchema } from "express-validator";

const schema = {
    auditorium: {
        notEmpty: true,
        isString: true,
        matches: {
            options: /\d{3}[a-c]{0,1}-\d[a]{0,1}/gm,
            errorMessage: 'auditroium field has invalid value (pattern: XXXw-X, X-number, w - a, b or c char)',
        }
    },
    auditorium_name: { notEmpty: true, isString: true },
    auditorium_capacity: { notEmpty: true, isNumeric: true },
    auditorium_type: { notEmpty: true, isString: true },
};

class AuditoriumController {
    static async getAuditoriums(req, res) {
        const auditoriums = await auditoriumService.read(req, res);
        res.json(auditoriums);
    }

    static async getCompAuditoriums(req, res) {
        const auditoriums = await auditoriumService.compAuditoriums(req, res);
        res.json(auditoriums);
    }

    static async getAuditoriumsWithSameCount(req, res) {
        const auditoriums = await auditoriumService.sameCount(req, res);
        res.json(auditoriums);
    }

    static async createAuditorium(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!AuditoriumController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: AuditoriumController.#getSchemaError(jsonValidation)});
            return;
        }

        const auditorium = await auditoriumService.create(req, res);
        res.json(auditorium);
    }

    static async updateAuditorium(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!AuditoriumController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: AuditoriumController.#getSchemaError(jsonValidation)});
            return;
        }

        const auditorium = await auditoriumService.update(req, res);
        res.json(auditorium);
    }

    static async deleteAuditorium(req, res) {
        const auditorium = await auditoriumService.delete(req, res);
        res.json(auditorium);
    }

    static async transaction(req, res) {
        const transaction = await auditoriumService.transaction(req, res);
        res.json(transaction);
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default AuditoriumController;