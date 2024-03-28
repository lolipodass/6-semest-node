import prismaClient from "../prisma/prisma-client.js";

const Teacher = prismaClient.teacher;

const getTeachers = async (req, res) => {
    let error = null;

    const teachers = await Teacher.findMany()
        .catch(err => error = err);

    if (teachers.length === 0) {
        error = 'Info: Teacher table is empty';
    }

    return error === null ? teachers : { message: error };
};

const createTeacher = async (req, res) => {
    let error = null;

    const teacher = await Teacher.create({
        data: {
            teacher: req.body.teacher,
            teacher_name: req.body.teacher_name,
            pulpit_id: req.body.pulpit_id
        }
    }).catch(() => error = `Error: Teacher ${req.body.teacher} is already exists`);

    return error === null ? teacher : { message: error };
};

const updateTeacher = async (req, res) => {
    let error = null;

    const teacher = await Teacher.update({
        where: { teacher: req.body.teacher },
        data: {
            teacher_name: req.body.teacher_name,
            pulpit_id: req.body.pulpit_id
        }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? teacher : { message: error };
};

const deleteTeacher = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const teacher = await Teacher.delete({
        where: { teacher: id }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? teacher : { message: error };
};

export default {
    create: createTeacher,
    read: getTeachers,
    update: updateTeacher,
    delete: deleteTeacher,
};