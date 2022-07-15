import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import passport from 'passport'
import {Usuario} from '../models/usuario.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';

export const login=(req, res)=>{
 res.render('index')
}

//probando sequelize
export const consultarusuario=async (req, res)=>{
  
const {id}=req.body;

let user= await Usuario.findOne({where: {id: id}})

res.json(user)

}

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
   
    console.log(newUser)
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
// export const validar=async(req, res) =>{
//     const {correo, password}= req.body;
//     const promisePool = pool.promise();
//     const [rows,fields]=await promisePool.query(`SELECT correo, password FROM usuario WHERE correo='${correo}';`)
//     if(rows.length==0){
//         req.flash("error", "el usuario no existe")
//         return res.redirect('/')
//     };
//     let match = await matchPassword(password, rows[0].password);
//     if(!match){
//         req.flash('error', 'Contraseña incorrecta')
//         return res.redirect('/')
//     }
//     req.flash("message", "Usuario validado")
//     res.redirect('/perfil')
// };

export const validar=passport.authenticate('local',{
    failureRedirect:'/login',
    successRedirect:'/',
    failureFlash: true
})

export const perfil=async(req, res) =>{
    console.log('req.user.id===>', req.user.id)
    console.log('req.user.id_rol===>', req.user.id_rol)
    if(!req.user.id){
        res.render('/login')
    }

    if(req.user.id_rol==1){
        console.log('el rol es admin')
        res.render('admin')
    };
    if(req.user.id_rol==2){
        console.log('el rol es supervisor')
        res.render('supervisor')
    };
    if(req.user.id_rol==3){
        console.log('el rol es docente')
        res.render('docente')
    };
    if(req.user.id_rol==4){
        console.log('el rol es alumno')
        res.render('alumno')
    };
 
      
}

export const validarAutenticacion=(req,res, next)=>{
    console.log('req.user ====>', req.user)
    console.log('req.isAuthenticated ====>', req.isAuthenticated())
    if(req.isAuthenticated()) return next();
    res.redirect('/login')
}