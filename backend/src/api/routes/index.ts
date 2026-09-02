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
import { requireRole } from '../middlewares/role.middleware.js';

const appRouter = Router();

appRouter.use('/auth', authRoutes);
appRouter.use(authMiddleware);

appRouter.use('/clients', requireRole(['ADMIN', 'VENDEDOR']), clientRoutes);
appRouter.use('/ventas', requireRole(['ADMIN', 'VENDEDOR']), ventaRoutes);
appRouter.use('/detalles-venta', requireRole(['ADMIN', 'VENDEDOR']), detalleVentaRoutes);

appRouter.use('/departamentos', requireRole(['ADMIN']), departamentoRoutes);
appRouter.use('/servicios', requireRole(['ADMIN', 'VENDEDOR']), serviciosRoutes);
appRouter.use('/paises', requireRole(['ADMIN', 'VENDEDOR']), paisesRoutes);
appRouter.use('/operadores', requireRole(['ADMIN', 'VENDEDOR']), operadoresRoutes);
appRouter.use('/aerolineas', requireRole(['ADMIN', 'VENDEDOR']), aerolineasRoutes);
appRouter.use('/gastos', requireRole(['ADMIN']), gastoRoutes);
appRouter.use('/estado-resultados', requireRole(['ADMIN']), estadoResultadosRoutes);

export default appRouter;
