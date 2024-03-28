import pulpitService from "../services/pulpit-service.js";
import { checkSchema } from "express-validator";

const schema = {
    create: {
        pulpit: { notEmpty: true, isString: true },
        pulpit_name: { notEmpty: true, isString: true },
        'faculty.faculty': { notEmpty: true, isString: true },
        'faculty.faculty_name': { notEmpty: true, isString: true },
    },
    update: {
        pulpit: { notEmpty: true, isString: true },
        pulpit_name: { notEmpty: true, isString: true },
        faculty: { notEmpty: true, isString: true }
    }
}

class PulpitController {
    static async getPulpits(req, res) {
        const pulpits = await pulpitService.read(req, res);
        res.json(pulpits);
    }

    static async getPulpitsByPage(req, res) {
        const pulpits = await pulpitService.byPage(req, res);
        res.json(pulpits);
    }

    static async getPulpitsWithoutTeachers(req, res) {
        const pulpits = await pulpitService.withoutTeachers(req, res);
        res.json(pulpits);
    }

    static async getPulpitsWithVladimir(req, res) {
        const pulpits = await pulpitService.withVladimir(req, res);
        res.json(pulpits);
    }

    static async createPulpit(req, res) {
        const jsonValidation = await checkSchema(schema.create).run(req);
        
        if (!PulpitController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: PulpitController.#getSchemaError(jsonValidation)});
            return;
        }

        const pulpit = await pulpitService.create(req, res);
        res.json(pulpit);
    }

    static async updatePulpit(req, res) {
        const jsonValidation = await checkSchema(schema.update).run(req);
        
        if (!PulpitController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: PulpitController.#getSchemaError(jsonValidation)});
            return;
        }

        const pulpit = await pulpitService.update(req, res);
        res.json(pulpit);
    }

    static async deletePulpit(req, res) {
        const pulpit = await pulpitService.delete(req, res);
        res.json(pulpit);
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default PulpitController;