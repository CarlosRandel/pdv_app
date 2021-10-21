//CARREGANDO OS MÓDULOS
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const admin = require('./Routes/admin')
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const usuarios = require('./Routes/usuario')
const passport = require('passport')
require("./config/auth")(passport)
const db = require("./config/db")
//-----------------------------------------------------------------


//CONFIGURAÇÃO
    //Sessão
        app.use(session({
            secret: "pdv_projet",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            
             next()
        })
    //body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))

        app.set('view engine', 'handlebars', path.join(__dirname + 'views'))
        app.use(express.static(path.join(__dirname + '../views')))
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI).then(() => {
            console.log("Conectado ao banco Mongo")
        }).catch((err) => {
            console.log("Ouve um erro: "+ err)
        })
    //Public
        app.use(express.static(path.join(__dirname, "public")))

    

//ROTAS principais
    app.get("/404", (req, res)=> {
        res.send(__dirname + 'Erro 404')
    })
    app.get('/', (req, res) => {
        res.render("./index")
    }
    app.use('/usuarios', usuarios)
    
    app.use('/admin', admin)
    
//OUTROS
const PORT = process.env.PORT || 8880
app.listen(PORT, () =>{
    console.log("Servico iniciado na porta " +PORT)
})
