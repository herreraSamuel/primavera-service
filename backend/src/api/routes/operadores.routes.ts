import { Router } from 'express';
import OperadoresController from '../controllers/operadores.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createOperadoresSchema, updateOperadoresSchema } from '../schemas/operadores.schema.js';

const router = Router({ strict: true });

router.get('/', OperadoresController.read);
router.get('/:id', OperadoresController.readById);
router.post('/', validateBody(createOperadoresSchema), OperadoresController.create);
router.patch('/:id', validateBody(updateOperadoresSchema), OperadoresController.update);
router.delete('/:id', OperadoresController.delete);

export default router;
