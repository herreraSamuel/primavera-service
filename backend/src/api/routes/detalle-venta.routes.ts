import { Router } from 'express';
import DetalleVentaController from '../controllers/detalle-venta.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createDetalleVentaSchema, updateDetalleVentaSchema } from '../schemas/detalle-venta.schema.js';

const router = Router({ strict: true });

router.get('/venta/:ventaId', DetalleVentaController.readByVentaId);
router.get('/:id', DetalleVentaController.readById);
router.post('/', validateBody(createDetalleVentaSchema), DetalleVentaController.create);
router.patch('/:id', validateBody(updateDetalleVentaSchema), DetalleVentaController.update);
router.delete('/:id', DetalleVentaController.delete);

export default router;
