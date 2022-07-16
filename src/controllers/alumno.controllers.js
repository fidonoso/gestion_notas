import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';

export const createAlumno=async(req, res)=>{ 
console.log('req.body', req.body)
res.json({message: "Alumno creado con exito"})
}