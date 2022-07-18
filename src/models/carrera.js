import {DataTypes} from 'sequelize'
import {sequelize} from '../database/conexion.js'
import {Alumno} from './alumno.js'


export const Carrera=sequelize.define('carrera',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    estado:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    estado_docente:{
        type:DataTypes.STRING,
        allowNull: false,
    },
 
},{
    timestamps:false
});

Carrera.hasMany(Alumno, {
    foreignKey: 'id_carrera',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});
