import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Alumno} from '../models/alumno.js'
import {Carrera} from '../models/carrera.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
moment.locale('es')

export const crearteSupervisor_o_Docente=async(req, res)=>{ 
    let errors=[];
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
   
   if( req.user.id_rol==2){   
    try {
        let estados_curso= await Carrera.findAll()
        let curso= await Alumno.findAll();
        let curso2=curso.map(el=>{
            el.nombre_carrera=estados_curso.find(x=>x.id==el.id_carrera).nombre;
            return el
        })
        let user=await Usuario.findByPk(req.session.passport.user)
        
        let roles=["Administrador de sistemas", "Supervisor", "Docente", "Alumno"]
        let ultimoAcceso= moment(user.updateAt).format('LLL')

        res.render('supervisor',{
            curso: curso2,
            user,
            rol: roles[user.id_rol-1],
            ultimoacceso:ultimoAcceso,
            entrada: "disabled"
        })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
   }else{
    req.flash('error', 'No estas autorizado')
    res.redirect('/forbidden')
   }
};

export const getAlumnos=async (req, res) => {
    let carrera
    let btnADM= "secondary"
    let btnCon= "secondary"
    let btnProg= "secondary"
    try {
        let estados_curso= await Carrera.findAll()
    
        let checkADM=estados_curso.find(x=>x.id=1).estado==1?"checked":"";
        let checkCon=estados_curso.find(x=>x.id=2).estado==1?"checked":"";
        let checkProg=estados_curso.find(x=>x.id=3).estado==1?"checked":"";
    
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
            checkADM,
            checkCon,
            checkProg
        })
    } catch (error) {
       res.status(500).json({message: error.message}) 
    }
   
}
export const getCarreras=async(req, res) => {

    let asig=await Carrera.findAll()

    res.json(asig)
}

export const setStateCarrera=async(req, res)=>{
    try {
        const {id, estado}=req.body
        const setState=await Carrera.findByPk(id)
        setState.estado=estado
        setState.estado_docente=estado
        await setState.save()
      
        let cursos=await Carrera.findAll()
        res.json(cursos)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    
    }
}