import express from 'express';
import TeacherController from '../controllers/teacher-controller.js';

const router = express.Router();

router.get('/', TeacherController.getTeachers);
router.post('/', TeacherController.createTeacher);
router.put('/', TeacherController.updateTeacher);
router.delete('/:id', TeacherController.deleteTeacher);

export default router;