import express from 'express';
import AuditoriumController from '../controllers/auditorium-controller.js';

const router = express.Router();

router.get('/', AuditoriumController.getAuditoriums);
router.get('/compauditoriums/:id', AuditoriumController.getCompAuditoriums);
router.get('/samecount', AuditoriumController.getAuditoriumsWithSameCount);
router.get('/transaction', AuditoriumController.transaction);
router.post('/', AuditoriumController.createAuditorium);
router.put('/', AuditoriumController.updateAuditorium);
router.delete('/:id', AuditoriumController.deleteAuditorium);

export default router;