import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import routes from './routes/routes.js';
import FacultyFluent from './fluent/faculties-fluent.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.use('/api/faculties', routes.faculty);
app.use('/api/pulpits', routes.pulpit);
app.use('/api/subjects', routes.subject);
app.use('/api/teachers', routes.teacher);
app.use('/api/auditorium-types', routes.auditoriumType);
app.use('/api/auditoriums', routes.auditorium);

app.get('/', (req, res) => {
    res.redirect('/index?page=1');
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/fluent', async (req, res) => {
    const facultyFluent = new FacultyFluent();
    (await (await facultyFluent.addFaculty('fit')).addFaculty('fip')).removeFaculty('fip');
    
    res.json(facultyFluent.faculties);
});

app.listen(3000, () => {
    console.log('Server running on localhost:3000');
});