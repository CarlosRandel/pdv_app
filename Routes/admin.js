const { Router } = require("express")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../Models/Produto")
const Produto = mongoose.model("produtos")
const {eAdmin}= require("../helpers/eAdmin")
// ROTA PARA PAG ADMIN
router.get('/', (req, res) => {
    res.render("admin/index")
})
//ROTA PARA CAD DE PRODUTOS
router.get('/addprodutos', eAdmin, (req, res) => {
    res.render("admin/addprodutos")
})
router.post('/produto/add',eAdmin, (req, res) => {
    var erros = []

    if(!req.body.produto || typeof req.body.produto == undefined || req.body.produto == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.quantidade || typeof req.body.quantidade == undefined || req.body.quantidade == null){
        erros.push({texto: "Adicione a quantidade!"})
    }
    if(req.body.quantidade.length < 1){
        erros.push({texto: "Quantidade muito baixo!"})
    }
    if(erros.length > 0){
        res.render("admin/addprodutos", {erros: erros})
    }else{
        const novoproduto = {
            produto: req.body.produto,
            quantidade: req.body.quantidade
        }
        new Produto(novoproduto).save().then(() => {
            req.flash("success_msg", "Produto registrado Com Sucesso")
            res.redirect("/admin/produtos")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao cadastrar o produto, tente novamente!")
            res.redirect("/admin")
        })

    }

    

})

//ROTA PARA CAD USER
router.get('/adduser', eAdmin,(req, res) =>{
    res.render("admin/adduser")
})

//ROTA PARA configuração
router.get('/config', eAdmin, (req, res) => {
    res.render("admin/config")
})
//Rota para listagem de produtos
router.get('/produtos', (req, res) => {
    Produto.find().lean().then((produtos) => {
        res.render("admin/produtos", {produtos: produtos})

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar os produtos")
        res.redirect("/admin")
    })
})
//Rota para edição de produtos 
router.get("/produtos/edit/:id", eAdmin, (req, res) => {
    Produto.findOne({_id:req.params.id}).lean().then((produto) =>{
       res.render("admin/editprodutos", {produto:produto}) 
    }).catch((err) => {
        req.flash("error_msg", "Esse Produto não exite")
        res.redirect("/admin/produtos")
    })
    
})

router.post("/produtos/edit",eAdmin, (req, res) =>{
    Produto.findOne({_id: req.body.id}).then((produto) =>{
        produto.produto = req.body.produto
        produto.quantidade = req.body.quantidade

        produto.save().then(()=>{
            req.flash("success_msg", "Produto editado com sucesso")
            res.redirect("/admin/produtos")
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro ao salvar o produto")
            res.redirect("/admin/produtos")
        })
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/produtos")
    })
})

    
router.post("/produtos/del", eAdmin, (req, res) =>{
        
    Produto.remove({_id: req.body.id}).then(()=>{
            
        req.flash("success_msg", "Produto deletado")
            
        res.redirect("/admin/produtos")
        
    }).catch((err)=>{
            
        req.flash("error_msg", "Houve um erro ao deletar o produto")
            
        res.redirect("/admin/produtos")
        
    })
})



module.exports = router