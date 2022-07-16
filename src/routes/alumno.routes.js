import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import {createAlumno} from '../controllers/alumno.controllers.js'

router.post('/createalumno',validarAutenticacion, createAlumno);

export default router