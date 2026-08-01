import { Router } from 'express';
import clientRoutes from './client.routes.js';
import departamentoRoutes from './departamento.routes.js';
import ventaRoutes from './venta.routes.js';

const appRouter = Router();

appRouter.use('/clients', clientRoutes);
appRouter.use('/departamentos', departamentoRoutes);
appRouter.use('/ventas', ventaRoutes);

export default appRouter;