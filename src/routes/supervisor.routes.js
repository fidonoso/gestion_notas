import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import {crearteSupervisor} from '../controllers/supervisor.controllers.js'

router.post('/createsupervisor',validarAutenticacion, crearteSupervisor);
// router.get('/login', login);
// router.post('/validar', validar)
// router.post('/crearusuario', crearUsuario)


// router.post('/consultarusuario', consultarusuario)

// router.get('/logout', userlogout)

export default router