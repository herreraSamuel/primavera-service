import { Router } from 'express';
import ClientController from '../controllers/client.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { clientSchema } from '@agency/shared';

const router = Router({ strict: true });

router.get('/', ClientController.read);
router.get('/:id', ClientController.readById);
router.post('/', validateBody(clientSchema), ClientController.create);
router.patch('/:id', ClientController.update);
router.delete('/:id', ClientController.delete);


export default router;