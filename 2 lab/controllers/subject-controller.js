import subjectService from "../services/subject-service.js";
import { checkSchema } from "express-validator";

const schema = {
    subject: { notEmpty: true, isString: true },
    subject_name: { notEmpty: true, isString: true },
    pulpit_id: { notEmpty: true, isString: true }
};

class SubjectController {
    static async getSubjects(req, res) {
        const subjects = await subjectService.read(req, res);
        res.json(subjects);
    }

    static async createSubject(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!SubjectController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: SubjectController.#getSchemaError(jsonValidation)});
            return;
        }

        const subject = await subjectService.create(req, res);
        res.json(subject);
    }

    static async updateSubject(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!SubjectController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: SubjectController.#getSchemaError(jsonValidation)});
            return;
        }

        const subject = await subjectService.update(req, res);
        res.json(subject);
    }

    static async deleteSubject(req, res) {
        const subject = await subjectService.delete(req, res);
        res.json(subject);
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default SubjectController;