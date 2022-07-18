import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Carrera} from '../models/carrera.js'
import {Alumno} from '../models/alumno.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
moment.locale('es')

export const crearteDocente=async(req, res)=>{ 


let errors=[];

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
        const newuser=await Usuario.create(sup)
        req.flash("success_msg", `Supervisor ${nombre} - ${apellido} creado con éxito`);
         res.redirect('/admin')

    }catch(e){
        req.flash('error_msg', 'Algo salió mal')
        res.redirect('/admin')
    }
}

res.json({message: "Docente creado con exito"})
}

export const getProfe=async (req, res) => {
    
    if(req.user.id_rol==3){

    try {
        let estados_curso= await Carrera.findAll()
        // parseInt(estados_curso[0].estado)

        let curso= await Alumno.findAll();
        let user=await Usuario.findByPk(req.session.passport.user)
        let roles=["Administrador de sistemas", "Supervisor", "Docente", "Alumno"]
        let ultimoAcceso= moment(user.updateAt).format('LLL')
        res.render('docente',{
            curso: curso,
            user,
            rol: roles[user.id_rol-1],
            ultimoacceso:ultimoAcceso,
            habilitado_admin: !!parseInt(estados_curso[0].estado),
            habilitado_prog: !!parseInt(estados_curso[1].estado),
            habilitado_cont:  !!parseInt(estados_curso[2].estado),
            estp_car_admin : !!parseInt(estados_curso[0].estado_docente),
            estp_car_prog: !!parseInt(estados_curso[1].estado_docente),
            estp_car_cont: !!parseInt(estados_curso[2].estado_docente),     
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }}else{
        req.flash('error', 'No estas autorizado')
        res.redirect('/forbidden')
    }     
};

export const getCarrerasadministracion=async(req, res)=>{

   try {
    let idC;
    if(req.body.carrera=='Administracion'){
        idC=1
    }
    if(req.body.carrera=='Programacion'){
        idC=2
    }
    if(req.body.carrera=='Contabilidad'){
        idC=3
    }
    //verificar si la carrera está cerrada por el supervisor|
    let estado_carrera=await Carrera.findAll({order: [['id', 'ASC']]})
 
    let carrera= await Alumno.findAll({where: {id_carrera: idC}})
    let user=await Usuario.findByPk(req.session.passport.user)
    let roles=["Administrador de sistemas", "Supervisor", "Docente", "Alumno"]
    let ultimoAcceso= moment(user.updateAt).format('LLL')

    let carrera2=carrera.map(x=>{
        x.estp=!!parseInt(estado_carrera[0].estado_docente)
        return x
    })

    res.render('administracion',{
        curso: carrera2,
        btnADM: "primary",
        habilitado_admin: !!parseInt(estado_carrera[0].estado),
        habilitado_prog: !!parseInt(estado_carrera[1].estado),
        habilitado_cont: !!parseInt(estado_carrera[2].estado),
        user,
        rol: roles[user.id_rol-1],
        ultimoacceso:ultimoAcceso,
        estp_car_admin : !!parseInt(estado_carrera[0].estado_docente),
        estp_car_prog: !!parseInt(estado_carrera[1].estado_docente),
        estp_car_cont: !!parseInt(estado_carrera[2].estado_docente),
        administracion: true,
        contabilidad: false,
        programacion:false
    })
   } catch (error) {
    return res.status(500).json({ message: error.message });
   }


    // res.json({message: 'ok polilla'})
}


export const getCarrerasprogramacion=async(req, res)=>{
    try {
        let idC;
        if(req.body.carrera=='Administracion'){
            idC=1
        }
        if(req.body.carrera=='Programacion'){
            idC=2
        }
        if(req.body.carrera=='Contabilidad'){
            idC=3
        }
      //verificar si la carrera está cerrada por el supervisor|
        let estado_carrera=await Carrera.findAll({order: [['id', 'ASC']]})
    
        let carrera= await Alumno.findAll({where: {id_carrera: idC}})
        let user=await Usuario.findByPk(req.session.passport.user)
        let roles=["Administrador de sistemas", "Supervisor", "Docente", "Alumno"]
        let ultimoAcceso= moment(user.updateAt).format('LLL')
        let carrera2=carrera.map(x=>{
            x.estp=!!parseInt(estado_carrera[1].estado_docente)
            return x
        })
    
        res.render('programacion',{
            curso: carrera2,
            btnProg: "primary",
            habilitado_admin: !!parseInt(estado_carrera[0].estado),
            habilitado_prog:!!parseInt(estado_carrera[1].estado),
            habilitado_cont: !!parseInt(estado_carrera[2].estado),
            user,
            rol: roles[user.id_rol-1],
            ultimoacceso:ultimoAcceso,
            estp_car_admin: !!parseInt(estado_carrera[0].estado_docente),
            estp_car_prog: !!parseInt(estado_carrera[1].estado_docente),
            estp_car_cont: !!parseInt(estado_carrera[2].estado_docente),
            administracion: false,
            contabilidad: false,
            programacion:true
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

  
}
export const getCarrerascontabilidad=async(req, res)=>{

    try {
        let idC;
    if(req.body.carrera=='Administracion'){
        idC=1
    }
    if(req.body.carrera=='Programacion'){
        idC=2
    }
    if(req.body.carrera=='Contabilidad'){
        idC=3
    }
    //verificar si la carrera está cerrada por el supervisor|
    let estado_carrera=await Carrera.findAll({order: [['id', 'ASC']]})

    let carrera= await Alumno.findAll({where: {id_carrera: idC}})
    let user=await Usuario.findByPk(req.session.passport.user)
    let roles=["Administrador de sistemas", "Supervisor", "Docente", "Alumno"]
    let ultimoAcceso= moment(user.updateAt).format('LLL')
    let carrera2=carrera.map(x=>{
        x.estp=!!parseInt(estado_carrera[2].estado_docente)
        return x
    })

    res.render('contabilidad',{
        curso: carrera2,
        btnCon: "primary",
        habilitado_admin:!!parseInt(estado_carrera[0].estado),
        habilitado_prog:!!parseInt(estado_carrera[1].estado),
        habilitado_cont: !!parseInt(estado_carrera[2].estado),
        user,
        rol: roles[user.id_rol-1],
        ultimoacceso:ultimoAcceso,
        estp_car_admin: !!parseInt(estado_carrera[0].estado_docente),
        estp_car_prog: !!parseInt(estado_carrera[1].estado_docente),
        estp_car_cont: !!parseInt(estado_carrera[2].estado_docente),
        administracion: false,
        contabilidad: true,
        programacion:false
    })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

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
    
        res.render('docente',{
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

export const setStateCarreradocente=async(req, res)=>{
    try {
        const {id, estado}=req.body
        const setState=await Carrera.findByPk(id)
        // setState.estado=estado
        setState.estado_docente=estado
        await setState.save()
      
        let cursos=await Carrera.findAll()
        res.json(cursos)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    
    }
}