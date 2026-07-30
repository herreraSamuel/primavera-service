import { Router } from 'express';
import DepartamentoController from '../controllers/departamento.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createDepartamentoSchema, updateDepartamentoSchema } from '../schemas/departamento.schema.js';

const router = Router({ strict: true });

router.get('/', DepartamentoController.read);
router.get('/:id', DepartamentoController.readById);
router.post('/', validateBody(createDepartamentoSchema), DepartamentoController.create);
router.patch('/:id', validateBody(updateDepartamentoSchema), DepartamentoController.update);
router.delete('/:id', DepartamentoController.delete);

export default router;
