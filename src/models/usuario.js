import {DataTypes} from 'sequelize'
import {sequelize} from '../database/conexion.js'

import bcrypt from "bcryptjs";

export const Usuario=sequelize.define('usuarios',{
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
    }
});

Usuario.beforeCreate(async (usuarios, options) => {
    const salt = await bcrypt.genSalt(8);
    usuarios.password=await bcrypt.hash(usuarios.password, salt);
  });

//   Usuario.hasMany(Rol, {
//     foreignKey: 'id_rol',
//     sourceKey: 'id',
//     onDelete: 'CASCADE'
// });

// Rol.belongsTo(Usuario, {
//     foreignKey: 'id_rol',
//     targetId: 'id'
// });
