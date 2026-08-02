import { Router } from 'express';
import AerolineasController from '../controllers/aerolineas.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createAerolineasSchema, updateAerolineasSchema } from '../schemas/aerolineas.schema.js';

const router = Router({ strict: true });

router.get('/', AerolineasController.read);
router.get('/:id', AerolineasController.readById);
router.post('/', validateBody(createAerolineasSchema), AerolineasController.create);
router.patch('/:id', validateBody(updateAerolineasSchema), AerolineasController.update);
router.delete('/:id', AerolineasController.delete);

export default router;
