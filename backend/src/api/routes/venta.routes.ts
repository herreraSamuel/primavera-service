import { Router } from 'express';
import VentaController from '../controllers/venta.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createVentaSchema, updateVentaSchema } from '../schemas/venta.schema.js';

const router = Router({ strict: true });

router.get('/', VentaController.read);
router.get('/:id', VentaController.readById);
router.post('/', validateBody(createVentaSchema), VentaController.create);
router.patch('/:id', validateBody(updateVentaSchema), VentaController.update);
router.delete('/:id', VentaController.delete);

export default router;
