import { Router } from 'express';
import GastoController from '../controllers/gasto.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { 
    createGastoSchema, 
    updateGastoSchema,
    createCatalogoGastoSchema,
    updateCatalogoGastoSchema 
} from '../schemas/gasto.schema.js';

const router = Router({ strict: true });

router.get('/', GastoController.read);
router.get('/summary', GastoController.getMonthlySummary);

router.post('/catalogo', validateBody(createCatalogoGastoSchema), GastoController.createCatalogo);
router.patch('/catalogo/:id', validateBody(updateCatalogoGastoSchema), GastoController.updateCatalogo);
router.delete('/catalogo/:id', GastoController.deleteCatalogo);

router.get('/:id', GastoController.readById);
router.post('/', validateBody(createGastoSchema), GastoController.create);
router.patch('/:id', validateBody(updateGastoSchema), GastoController.update);
router.delete('/:id', GastoController.delete);

export default router;
