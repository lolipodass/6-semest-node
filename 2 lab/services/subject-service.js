import prismaClient from "../prisma/prisma-client.js";

const Subject = prismaClient.subject;

const getSubjects = async (req, res) => {
    let error = null;

    const subjects = await Subject.findMany()
        .catch(err => error = err);

    if (subjects.length === 0) {
        error = 'Info: Subject table is empty';
    }

    return error === null ? subjects : { message: error };
};

const createSubject = async (req, res) => {
    let error = null;

    const subject = await Subject.create({
        data: {
            subject: req.body.subject,
            subject_name: req.body.subject_name,
            pulpit_id: req.body.pulpit_id
        }
    }).catch(() => error = `Error: Subject ${req.body.subject} is already exists`);

    return error === null ? subject : { message: error };
};

const updateSubject = async (req, res) => {
    let error = null;

    const subject = await Subject.update({
        where: { subject: req.body.subject },
        data: {
            subject_name: req.body.subject_name,
            pulpit_id: req.body.pulpit_id
        }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? subject : { message: error };
};

const deleteSubject = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const subject = await Subject.delete({
        where: { subject: id }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? subject : { message: error };
};

export default {
    create: createSubject,
    read: getSubjects,
    update: updateSubject,
    delete: deleteSubject,
};