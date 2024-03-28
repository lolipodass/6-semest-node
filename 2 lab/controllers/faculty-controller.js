import facultyService from "../services/faculty-service.js";
import { checkSchema } from "express-validator";

const schema = {
    faculty: { notEmpty: true, isString: true },
    faculty_name: { notEmpty: true, isString: true },
    pulpits: {
        optional: true,
        isArray: {
            bail: true,
            options: {
                min: 1
            }
        }
    },
    'pulpits.*.pulpit': { notEmpty: true, isString: true },
    'pulpits.*.pulpit_name': { notEmpty: true, isString: true }
};

class FacultyController {
    static async getFaculties(req, res) {
        const faculties = await facultyService.read(req, res);
        res.json(faculties);
    }

    static async getSubjects(req, res) {
        const facultySubjects = await facultyService.subjects(req, res);
        res.json(facultySubjects);
    }

    static async createFaculty(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!FacultyController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: FacultyController.#getSchemaError(jsonValidation)});
            return;
        }

        const faculty = await facultyService.create(req, res);
        res.json(faculty);
    }

    static async updateFaculty(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!FacultyController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: FacultyController.#getSchemaError(jsonValidation)});
            return;
        }

        const faculty = await facultyService.update(req, res);
        res.json(faculty);
    }

    static async deleteFaculty(req, res) {
        const faculty = await facultyService.delete(req, res);
        res.json(faculty);
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default FacultyController;