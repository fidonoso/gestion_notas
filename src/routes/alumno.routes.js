import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import {createAlumno, updatenote, getAlumno} from '../controllers/alumno.controllers.js'

router.post('/createalumno',validarAutenticacion, createAlumno);
router.post('/updatenote',validarAutenticacion, updatenote );
router.get('/alumno', validarAutenticacion, getAlumno)

export default router