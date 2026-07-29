import { Router } from 'express';
import ClientController from '../controllers/client.controller.js';

const router = Router({ strict: true });

router.get('/', ClientController.read);

router.post('/', ClientController.create);

export default router; 