if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://carlosrandel:848291rdl@pdvapp.k3zgl.mongodb.net/pdvapp"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/pdvapp"}
}