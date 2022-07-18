import {Router} from 'express'
const router=Router();
import {validarAutenticacion} from '../controllers/index.controller.js'
import {crearteDocente, getProfe, getAlumnos, getCarrerasadministracion, getCarrerasprogramacion, getCarrerascontabilidad, setStateCarreradocente} from '../controllers/docente.controllers.js'

router.post('/createdocente',validarAutenticacion, crearteDocente);
router.get('/docente', validarAutenticacion, getProfe)
router.post('/docente/administracion', validarAutenticacion, getCarrerasadministracion)
router.post('/docente/programacion', validarAutenticacion, getCarrerasprogramacion)
router.post('/docente/contabilidad', validarAutenticacion, getCarrerascontabilidad)
router.put('/setstatecarreradocente', validarAutenticacion, setStateCarreradocente)

export default router