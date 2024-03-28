import teacherService from "../services/teacher-service.js";
import { checkSchema } from "express-validator";

const schema = {
    teacher: { notEmpty: true, isString: true },
    teacher_name: { notEmpty: true, isString: true },
    pulpit_id: { notEmpty: true, isString: true }
};

class TeacherController {
    static async getTeachers(req, res) {
        const teachers = await teacherService.read(req, res);
        res.json(teachers);
    }

    static async createTeacher(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!TeacherController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: TeacherController.#getSchemaError(jsonValidation)});
            return;
        }

        const teacher = await teacherService.create(req, res);
        res.json(teacher);
    }

    static async updateTeacher(req, res) {
        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!TeacherController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: TeacherController.#getSchemaError(jsonValidation)});
            return;
        }

        const teacher = await teacherService.update(req, res);
        res.json(teacher);
    }

    static async deleteTeacher(req, res) {
        const teacher = await teacherService.delete(req, res);
        res.json(teacher);
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default TeacherController;