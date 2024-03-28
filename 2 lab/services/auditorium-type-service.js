import prismaClient from "../prisma/prisma-client.js";

const AuditoriumType = prismaClient.auditorium_Type;

const getAuditoriumTypes = async (req, res) => {
    let error = null;

    const auditoriumTypes = await AuditoriumType.findMany()
        .catch(err => error = err);

    if (auditoriumTypes.length === 0) {
        error = 'Info: Auditorium_Type table is empty';
    }

    return error === null ? auditoriumTypes : { message: error };
};

const createAuditoriumType = async (req, res) => {
    let error = null;

    const auditoriumType = await AuditoriumType.create({
        data: {
            auditorium_type: req.body.auditorium_type,
            auditorium_typename: req.body.auditorium_typename
        }
    }).catch(() => error = `Error: AuditoriumType ${req.body.auditoriumType} is already exists`);

    return error === null ? auditoriumType : { message: error };
};

const updateAuditoriumType = async (req, res) => {
    let error = null;

    const auditoriumType = await AuditoriumType.update({
        where: { auditorium_type: req.body.auditorium_type, },
        data: {
            auditorium_typename: req.body.auditorium_typename
        }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? auditoriumType : { message: error };
};

const deleteAuditoriumType = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const auditoriumType = await AuditoriumType.delete({
        where: { auditorium_type: id }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? auditoriumType : { message: error };
};

const getAuditoriums = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const auditoriums = await AuditoriumType.findUnique({
        where: {
            auditorium_type: id
        },
        select: {
            auditorium_type: true,
            auditoriums: {
                select: {
                    auditorium: true
                }
            }
        }
    }).catch((err) => error = err);

    return error === null ? auditoriums : error;
};

export default {
    create: createAuditoriumType,
    read: getAuditoriumTypes,
    update: updateAuditoriumType,
    delete: deleteAuditoriumType,
    auditoriums: getAuditoriums
};