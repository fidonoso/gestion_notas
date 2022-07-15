import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import { login, crearUsuario,crearUsuario2, validar, perfil, userlogout, consultarusuario} from '../controllers/index.controller.js'

router.get('/',validarAutenticacion, perfil);
router.get('/login', login);
router.post('/validar', validar)
router.post('/crearusuario', crearUsuario)


router.post('/consultarusuario', consultarusuario)

router.get('/logout', userlogout)

export default router