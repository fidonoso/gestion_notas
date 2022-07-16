import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import { login, crearUsuario,crearUsuario2, validar, perfil, userlogout, consultarusuario, LogAdmin} from '../controllers/index.controller.js'

router.get('/',validarAutenticacion, perfil);
router.get('/login', login);
router.post('/validar', validar)
router.post('/crearusuario', crearUsuario)
router.get('/admin', validarAutenticacion, LogAdmin)


router.post('/consultarusuario', consultarusuario)

router.get('/logout', userlogout)

export default router