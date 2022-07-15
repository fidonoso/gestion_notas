import passport from 'passport';
const LocalStrategy=require('passport-local').Strategy;
import {sequelize} from "../database/conexion.js";

import {encryptPassword, matchPassword}from '../helpers/encrypterpass.js'
import {Usuario} from '../models/usuario.js'

passport.use(new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password'

},async(correo, password, done)=>{
    //si existe el correo
   const user= await Usuario.findOne({ where: { correo: correo } })
    if(!user){
        console.log('control 1')
        return done(null, false, {message: "El usuario no existe"})
    }else{
       let match = await matchPassword(password, user.password);
        if(!match){
            console.log('archivo passport - contraseñas no coinciden')
        return done(null, false, {message: "Contraseña incorrecta"})
        }else{
            console.log('control3 - Estrategia passport creada')
            return done(null, user)
        }
    }
}));

passport.serializeUser((user, done)=>{
    console.log('serializado ok con passport')
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    const user =await Usuario.findOne({ where: { id: id }})
    console.log('Desserializdo ok con passport')
    if(user){
        done(null, user)
    }
}) 