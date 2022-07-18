import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
moment.locale('es')
export const login=(req, res)=>{
 res.render('index')
}

//probando sequelize
export const consultarusuario=async (req, res)=>{
  
const {id}=req.body;

let user= await Usuario.findOne({where: {id: id}})

res.json(user)

}

//para crear un administraor de sistemas con postman
export const crearUsuario=async (req, res)=>{
try {
    const { correo } = req.body;
    req.body.id=uuidv4();
   const user= await Usuario.findOne({ where: { correo: correo } })
 
    if(user){
        req.flash("error", "el usuario ya existe")
        return res.json({message: "El usuario ya existe"})
    };
    let id_rol= parseInt(req.body.id_rol);
    const newUser= await Usuario.create(req.body)
    req.flash('message', 'Usuario registrado con éxito')
    res.json({message: "usuario registrado con éxito"})
} catch (error) {
    req.flash("error", "Ha ocurrido un error en el servidor");
    res.json({message: "Ha ocurrido un error en el servidor"})
}
};

export const userlogout = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  };


export const validar=passport.authenticate('local',{
    failureRedirect:'/login',
    successRedirect:'/',
    failureFlash: true
})

export const LogAdmin=async(req, res) => {
    try{
        const user= await Usuario.findOne({where: {id: req.user.id}})
        let roles=["Administrador de sistemas", "Supervisor", "Docente", "Alumno"]
        let ultimoAcceso= moment(user.updateAt).format('LLL')
    
        res.render("admin",{
            user,
            rol: roles[user.id_rol-1],
            ultimoacceso:ultimoAcceso
        })
    }catch(e){
        console.log(e)
        res.redirect('/login')
    }
}


export const perfil=async(req, res) =>{
    console.log('req.user.id===>', req.user.id)
    console.log('req.user.id_rol===>', req.user.id_rol)

    // console.log('user==>', user)
    if(!req.user.id){
        res.render('/login')
    }

    if(req.user.id_rol==1){
        console.log('el rol es admin', req.flash('error'))
        req.flash('success_msg', 'logueado como administrador')
        res.redirect('/admin')
    };
    if(req.user.id_rol==2){
        console.log('el rol es supervisor')
        req.flash('success_msg', 'logueado como supervisor')
        res.redirect('/supervisor')
    };
    if(req.user.id_rol==3){
        console.log('el rol es docente')
        req.flash('success_msg', 'logueado como Docente')
        res.redirect('/docente')
    };
    if(req.user.id_rol==4){
        console.log('el rol es alumno')
        req.flash('success_msg', 'logueado como alumno')
        res.redirect('/alumno')
    };
 
      
}

export const validarAutenticacion=(req,res, next)=>{
    // console.log('req.user ====>', req.user)
    console.log('req.isAuthenticated ====>', req.isAuthenticated())
    if(req.isAuthenticated()) return next();
    res.redirect('/login')
}