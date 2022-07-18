import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import {crearteSupervisor_o_Docente, getSuper, getAlumnos, getCarreras, setStateCarrera} from '../controllers/supervisor.controllers.js'

router.post('/createsupervisor',validarAutenticacion, crearteSupervisor_o_Docente);
router.get('/supervisor',validarAutenticacion, getSuper )
router.post('/getalumnos',validarAutenticacion, getAlumnos  )
router.get('/getcarreras', validarAutenticacion, getCarreras)
router.put('/setstatecarrera', validarAutenticacion, setStateCarrera)
// router.get('/login', login);
// router.post('/validar', validar)
// router.post('/crearusuario', crearUsuario)


// router.post('/consultarusuario', consultarusuario)

// router.get('/logout', userlogout)

export default router