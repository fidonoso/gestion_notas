import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import {crearteDocente} from '../controllers/docente.controllers.js'

router.post('/createdocente',validarAutenticacion, crearteDocente);

export default router