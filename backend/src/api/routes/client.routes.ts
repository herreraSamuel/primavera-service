import { Router } from 'express';
import ClientController from '../controllers/client.controller.js';

const router = Router({ strict: true });

router.get('/', ClientController.read);
router.post('/', ClientController.create);
router.patch('/:id', ClientController.update);
router.delete('/:id', ClientController.delete);

export default router;