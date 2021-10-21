const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model de Usuario
require("../Models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'usuario', passwordField:'senha'}, (usuario, senha, done)=>{

        Usuario.findOne({usuario: usuario}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: "esta conta não esta cadastrada"})
            }
            bcrypt.compare(senha, usuario.senha, (erro, batem) =>{
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Usuário ou senha incorreto"})
                }
            })
        })
    }))


    passport.serializeUser((usuario, done)=>{
        done( null, usuario.id)

    })
    passport.deserializeUser((id, done)=>{
        Usuario.findById(id, (err, usuario)=>{
            done(err, usuario)
        })
    })


}