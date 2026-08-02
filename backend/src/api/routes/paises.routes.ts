import { Router } from 'express';
import PaisesController from '../controllers/paises.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createPaisesSchema, updatePaisesSchema } from '../schemas/paises.schema.js';

const router = Router({ strict: true });

router.get('/', PaisesController.read);
router.get('/:id', PaisesController.readById);
router.post('/', validateBody(createPaisesSchema), PaisesController.create);
router.patch('/:id', validateBody(updatePaisesSchema), PaisesController.update);
router.delete('/:id', PaisesController.delete);

export default router;
