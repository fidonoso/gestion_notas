import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Alumno} from '../models/alumno.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';

export const crearteSupervisor_o_Docente=async(req, res)=>{ 
    let errors=[];
    console.log('req.body===>', req.body)
    const {nombre, apellido, correo, password, password2, inlineRadioOptions:id_rol}= req.body;
   
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
            id_rol: parseInt(id_rol)
        }
        // console.log(sup)
        try{
            const newuser=await Usuario.create(sup)
            req.flash("success_msg", `Supervisor ${nombre} - ${apellido} creado con éxito`);
             res.redirect('/admin')

        }catch(e){
            console.log(e)
            req.flash('error_msg', 'Algo salió mal')
            res.redirect('/admin')
        }
    }
};

export const getSuper=async (req, res) => {
    res.render('supervisor')
}

export const getAlumnos=async (req, res) => {
    let carrera
    let btnADM= "secondary"
    let btnCon= "secondary"
    let btnProg= "secondary"
    if(req.body.carrera=="Administracion"){
        carrera=1
        btnADM="primary"
    }
    if(req.body.carrera=="Contabilidad"){
        carrera=3
        btnCon="primary"
    }
    if(req.body.carrera=="Programacion"){
        carrera=2
        btnProg="primary"
    }

    let curso= await Alumno.findAll({where: {id_carrera: carrera}});

    res.render('supervisor',{
        curso: curso,
        btnADM,
        btnCon,
        btnProg,
    })
}