import express from "express";
import SubjectController from "../controllers/subject-controller.js";

const router = express.Router();

router.get('/', SubjectController.getSubjects);
router.post('/', SubjectController.createSubject);
router.put('/', SubjectController.updateSubject);
router.delete('/:id', SubjectController.deleteSubject)

export default router;