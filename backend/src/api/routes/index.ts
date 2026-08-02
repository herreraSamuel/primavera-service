import { Router } from 'express';
import clientRoutes from './client.routes.js';
import departamentoRoutes from './departamento.routes.js';
import ventaRoutes from './venta.routes.js';
import detalleVentaRoutes from './detalle-venta.routes.js';
import serviciosRoutes from './servicios.routes.js';

const appRouter = Router();

appRouter.use('/clients', clientRoutes);
appRouter.use('/departamentos', departamentoRoutes);
appRouter.use('/ventas', ventaRoutes);
appRouter.use('/detalles-venta', detalleVentaRoutes);
appRouter.use('/servicios', serviciosRoutes);

export default appRouter;