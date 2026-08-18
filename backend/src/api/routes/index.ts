import { Router } from 'express';
import clientRoutes from './client.routes.js';
import departamentoRoutes from './departamento.routes.js';
import ventaRoutes from './venta.routes.js';
import detalleVentaRoutes from './detalle-venta.routes.js';
import serviciosRoutes from './servicios.routes.js';
import paisesRoutes from './paises.routes.js';
import operadoresRoutes from './operadores.routes.js';
import aerolineasRoutes from './aerolineas.routes.js';
import gastoRoutes from './gasto.routes.js';
import estadoResultadosRoutes from './estado-resultados.routes.js';
import authRoutes from './auth.routes.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const appRouter = Router();

appRouter.use('/auth', authRoutes);

appRouter.use(authMiddleware);

appRouter.use('/clients', clientRoutes);
appRouter.use('/departamentos', departamentoRoutes);
appRouter.use('/ventas', ventaRoutes);
appRouter.use('/detalles-venta', detalleVentaRoutes);
appRouter.use('/servicios', serviciosRoutes);
appRouter.use('/paises', paisesRoutes);
appRouter.use('/operadores', operadoresRoutes);
appRouter.use('/aerolineas', aerolineasRoutes);
appRouter.use('/gastos', gastoRoutes);
appRouter.use('/estado-resultados', estadoResultadosRoutes);

export default appRouter;
