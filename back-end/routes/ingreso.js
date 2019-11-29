import routerx from 'express-promise-router';
import ingresoController from '../controllers/IngresoController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyAlmacenero, ingresoController.add);
router.get('/query', auth.verifyAlmacenero, ingresoController.query);
router.get('/list', auth.verifyAlmacenero, ingresoController.list);
router.get('/consultafechas', auth.verifyUsuario, ingresoController.consultaFechas);
router.get('/grafico12meses', auth.verifyUsuario, ingresoController.grafico12meses);
// router.put('/update', auth.verifyAlmacenero, ingresoController.udpdate);
// router.delete('/remove', auth.verifyAlmacenero, ingresoController.remove);
router.put('/activate', auth.verifyAlmacenero, ingresoController.activate);
router.put('/deactivate', auth.verifyAlmacenero, ingresoController.deactivate);

export default router;