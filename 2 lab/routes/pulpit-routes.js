import express from 'express';
import PulpitController from '../controllers/pulpit-controller.js';

const router = express.Router();

router.get('/', PulpitController.getPulpits);
router.get('/withoutTeachers', PulpitController.getPulpitsWithoutTeachers);
router.get('/withVladimir', PulpitController.getPulpitsWithVladimir);
router.get('/page/:page', PulpitController.getPulpitsByPage);
router.post('/', PulpitController.createPulpit);
router.put('/', PulpitController.updatePulpit);
router.delete('/:id', PulpitController.deletePulpit);

export default router;