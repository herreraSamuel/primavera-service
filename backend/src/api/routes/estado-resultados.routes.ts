import { Router } from 'express';
import EstadoResultadosController from '../controllers/estado-resultados.controller.js';

const router = Router({ strict: true });

router.get('/', EstadoResultadosController.getResumen);

export default router;
