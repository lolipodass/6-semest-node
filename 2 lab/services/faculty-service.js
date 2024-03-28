import prismaClient from "../prisma/prisma-client.js"

const Faculty = prismaClient.faculty;

const getFaculties = async (req, res) => {
    let error = null;

    const faculties = await Faculty.findMany()
        .catch(err => error = err);

    if (faculties.length === 0) {
        error = 'Info: Faculty table is empty';
    }

    return error === null ? faculties : { message: error };
};

const createFaculty = async (req, res) => {
    let error = null;

    const faculty = await Faculty.create({
        data: {
            faculty: req.body.faculty,
            faculty_name: req.body.faculty_name
        }
    }).catch(() => error = `Error: Faculty ${req.body.faculty} is already exists`);

    if ('pulpits' in req.body) {
        req.body.pulpits.forEach(async (p) => {
            await prismaClient.pulpit.upsert({
                where: { pulpit: p.pulpit },
                create: { 
                    pulpit: p.pulpit,
                    pulpit_name: p.pulpit_name,
                    faculty_id: faculty.faculty
                },
                update: {}
            }).catch(err => error = err);
        });
    }

    return error === null ? faculty : { message: error };
};

const updateFaculty = async (req, res) => {
    let error = null;

    const faculty = await Faculty.update({
        where: { faculty: req.body.faculty },
        data: { faculty_name: req.body.faculty_name }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? faculty : { message: error };
};

const deleteFaculty = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const faculty = await Faculty.delete({
        where: { faculty: id }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? faculty : { message: error };
}

const getSubjects = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const facultySubjects = await Faculty.findUnique({
        where: {
            faculty: id
        },
        select: {
            faculty: true,
            pulpits: {
                select: {
                    pulpit: true,
                    subjects: {
                        select: {
                            subject_name: true
                        }
                    }
                }
            }
        }
    }).catch((err) => error = err);

    return error === null ? facultySubjects : error;
};

export default {
    create: createFaculty,
    read: getFaculties,
    update: updateFaculty,
    delete: deleteFaculty,
    subjects: getSubjects
};