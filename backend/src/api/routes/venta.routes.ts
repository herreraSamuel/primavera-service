import { Router } from 'express';
import VentaController from '../controllers/venta.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { ventaSchema, updateVentaSchema } from '@agency/shared';

const createVentaSchema = ventaSchema;

const router = Router({ strict: true });

router.get('/', VentaController.read);
router.get('/estadisticas', requireRole(['ADMIN']), VentaController.estadisticas);
router.get('/:id', VentaController.readById);
router.post('/', validateBody(createVentaSchema), VentaController.create);
router.patch('/:id', validateBody(updateVentaSchema), VentaController.update);
router.delete('/:id', VentaController.delete);

export default router;
