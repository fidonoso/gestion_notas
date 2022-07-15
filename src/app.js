import express from 'express'
const app=express();
import config from './config.js';
import exphbs from "express-handlebars";
import path from "path";
import morgan from "morgan";
import session from "express-session";
import flash from "connect-flash";
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
import cookieParser from 'cookie-parser'
import passport from 'passport';
require('./config/passport.js')
import indexRoutes from './routes/index.routes.js'
import main from './database/start_bd.js' //para iniciar la base de datos
main()
import {sequelize} from "./database/conexion.js";
var SequelizeStore = require("connect-session-sequelize")(session.Store)
import  './models/sessions.js'





//configuraciones

app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
        inc: function (value, options) {
          return parseInt(value) + 1;
        },   
    },   
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set("view engine", ".hbs");

//Middleware
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    // id_rol: session.id_rol,
    // id: session.user
  };
}

const store = new SequelizeStore({
  db: sequelize,
  table: "Session",
  extendDefaultFields: extendDefaultFields,
});

// guardado de sesiones



// const MYSQLStore= require('express-mysql-session')(session)
// import MYSQLStore from 'express-mysql-session'
// const options={
//     host: config.MYSQL_HOST,
//     port: config.MYSQL_PORT,
//     user: config.MYSQL_USER,
//     password: config.MYSQL_PASSWORD,
//     database: config.MYSQL_DATABASE,
//     schema: {
// 		tableName: 'sessions',
// 		columnNames: {
// 			session_id: 'session_id',
// 			expires: 'expires',
// 			data: 'data'
// 		}
// 	}
// };

// console.log(options)
// const sessionStore= new MYSQLStore(options,  pool.promise())
// console.log('config=>',config)

app.use(session({
  key: 'prueba3',
  secret:'Prueba3_admin_serv_web',
  store: store,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//variables globales
app.use((req, res, next)=>{
  res.locals.message=req.flash('message')
  res.locals.error=req.flash('error')
  res.locals.user = req.user || req.flash("user");
  
  next();
})

//Archivos estaticos
app.use(express.static(__dirname + '/public'));


//routes
app.use(indexRoutes)

//restringido
app.use((req, res)=>{
  res.render('404')
})

export default app