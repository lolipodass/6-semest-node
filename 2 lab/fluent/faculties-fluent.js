import prismaClient from "../prisma/prisma-client.js";

const Faculty = prismaClient.faculty;

class FacultyFluent {
    constructor() {
        this.faculties = {};
    }

    async addFaculty(id) {
        const faculty = await Faculty.findUnique({
            where: {
                faculty: id
            }
        });

        if (faculty) {
            this.faculties[id] = faculty;
        }

        return this;
    }

    removeFaculty(id) {
        if (id in this.faculties) {
            delete this.faculties[id];
        }

        return this;
    }
}

export default FacultyFluent;