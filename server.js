
// Configuração global do server
const express = require("express")
const server = express()
// Configuração para os arquivos estaticos
server.use(express.static('public'))

// Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// Conexão server.js com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '8694',
    host: 'localhost',
    port: 5432,
    database: 'Underworld'
})

// Configuração do template engine
const nunjuncks = require("nunjucks")
nunjuncks.configure("./", {
    express: server,
    noCache: true,
})


// Apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")
        
        const donors = result.rows;
        return res.render("index.html", { donors })
    })      
})
// Coletar dados do úsuario
server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == '' || email == '' || blood == ''){
        return res.send("Todos os campos são obrigatórios")
    }



    // Passando dados coletado para o DB
    const query = 
    `INSERT INTO donors ("name", "email", "blood")
     VALUES ($1, $2, $3)`

     const values = [name, email, blood]

    db.query(query, values, function(err){     
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
 

    
})



// Ligar o server (npm start)
server.listen(3000, function(){
    console.log("Server Start")
})


