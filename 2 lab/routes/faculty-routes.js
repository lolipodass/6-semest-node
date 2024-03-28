import express from 'express';
import FacultyController from '../controllers/faculty-controller.js';

const router = express.Router();

router.get('/', FacultyController.getFaculties);
router.get('/:id/subjects', FacultyController.getSubjects);
router.post('/', FacultyController.createFaculty);
router.put('/', FacultyController.updateFaculty);
router.delete('/:id', FacultyController.deleteFaculty);

export default router;