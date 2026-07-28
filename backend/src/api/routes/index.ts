import { Router } from 'express';
import clientRoutes from './client.routes.js';

const appRouter = Router();

appRouter.use('/clients', clientRoutes);

export default appRouter;