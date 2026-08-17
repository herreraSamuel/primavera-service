import { Router } from 'express';
import GastoController from '../controllers/gasto.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createGastoSchema, updateGastoSchema } from '../schemas/gasto.schema.js';

const router = Router({ strict: true });

router.get('/', GastoController.read);
router.get('/:id', GastoController.readById);
router.post('/', validateBody(createGastoSchema), GastoController.create);
router.patch('/:id', validateBody(updateGastoSchema), GastoController.update);
router.delete('/:id', GastoController.delete);

export default router;
