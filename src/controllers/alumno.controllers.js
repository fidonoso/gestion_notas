import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Alumno} from '../models/alumno.js'
import {Carrera} from '../models/carrera.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';

export const createAlumno=async(req, res)=>{ 
let carrera2;
let errors=[];
console.log('req.body===>', req.body)
const {nombre, apellido, correo, password, password2, inlineRadioOptions: carrera}= req.body;

if(carrera=="Administración"){
    carrera2=1
}
if(carrera=="Programación"){
    carrera2=2
}
if(carrera=="Contabilidad"){
    carrera2=3
}

let id_rol=4
if (password != password2) {
errors.push({ text: "Las contraseñas no coinciden" });
}
if (password.length < 4) {
errors.push({ text: "Las contraseñas deben tener mas de 4 digitos" });
}
const email= await Alumno.findOne({where: {correo: correo}})
if(email){  
    errors.push({ text: "El Alumno ya exite" });        
}     
if(errors.length>0) { 
let errores=errors.map(el=>`${el.text}`).join('. ')
req.flash('error', errores)
res.redirect('/supervisor')
    
} else{   
    let alum={
        id: uuidv4(),
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: password,
        id_rol: 4,
        id_carrera: carrera2
    }
    console.log(alum)
    try{
        console.log('llegue al try')
        const newuser=await Alumno.create(alum)
        req.flash("success_msg", `Alumno ${nombre} - ${apellido} creado con éxito`);
         res.redirect('/supervisor')

    }catch(e){
        console.log('no llegue al try', e)
        req.flash('error_msg', 'Algo salió mal')
        res.redirect('/supervisor')
    }
}

// res.json({message: "Alumno creado con exito"})
}

