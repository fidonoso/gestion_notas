import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';

export const crearteDocente=async(req, res)=>{ 
console.log('req.body', req.body)

let errors=[];
console.log('req.body', req.body)
const {nombre, apellido, correo, password, password2}= req.body;
if (password != password2) {
errors.push({ text: "Las contraseñas no coinciden" });
}
if (password.length < 4) {
errors.push({ text: "Las contraseñas deben tener mas de 4 digitos" });
}
const email= await Usuario.findOne({where: {correo: correo}})
if(email){  
    errors.push({ text: "El usuario ya exite" });        
}     
if(errors.length>0) { 
let errores=errors.map(el=>`${el.text}`).join('. ')
req.flash('error', errores)
res.redirect('/admin')
    
} else{   
    let sup={
        id: uuidv4(),
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: password,
        id_rol: 3
    }
    try{
        console.log('llegue al try')
        const newuser=await Usuario.create(sup)
        req.flash("success_msg", `Supervisor ${nombre} - ${apellido} creado con éxito`);
         res.redirect('/admin')

    }catch(e){
        console.log('no llegue al try', e)
        req.flash('error_msg', 'Algo salió mal')
        res.redirect('/admin')
    }
}

res.json({message: "Docente creado con exito"})
}