import { Router } from 'express';
import ServiciosController from '../controllers/servicios.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createServiciosSchema, updateServiciosSchema } from '../schemas/servicios.schema.js';

const router = Router({ strict: true });

router.get('/', ServiciosController.read);
router.get('/:id', ServiciosController.readById);
router.post('/', validateBody(createServiciosSchema), ServiciosController.create);
router.patch('/:id', validateBody(updateServiciosSchema), ServiciosController.update);
router.delete('/:id', ServiciosController.delete);

export default router;
