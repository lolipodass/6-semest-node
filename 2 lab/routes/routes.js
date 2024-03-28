import facultyRoutes from './faculty-routes.js';
import pulpitRoutes from './pulpit-routes.js';
import subjectRoutes from './subject-routes.js';
import teacherRoutes from './teacher-routes.js';
import auditoriumTypeRoutes from './auditorium-type-routes.js';
import auditoriumRoutes from './auditorium-routes.js';

export default {
    faculty: facultyRoutes,
    pulpit: pulpitRoutes,
    subject: subjectRoutes,
    teacher: teacherRoutes,
    auditorium: auditoriumRoutes,
    auditoriumType: auditoriumTypeRoutes
};