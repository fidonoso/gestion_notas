import {DataTypes} from 'sequelize'
import {sequelize} from '../database/conexion.js'

import bcrypt from "bcryptjs";

export const Alumno=sequelize.define('alumnos',{
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    apellido:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    correo:{
        type:DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
    },
    nota1: {
        type: DataTypes.INTEGER,
    },
    nota2: {
        type: DataTypes.INTEGER,
    },
    nota3: {
        type: DataTypes.INTEGER,
    }
}, {
    timestamps:true
});

Alumno.beforeCreate(async (alumnos, options) => {
    const salt = await bcrypt.genSalt(8);
    alumnos.password=await bcrypt.hash(alumnos.password, salt);
  });
