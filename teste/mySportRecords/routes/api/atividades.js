var express = require('express');
var router = express.Router();
var myDB = __dirname + "/myregs2.json"
var jsonfile = require('jsonfile')
var url = require('url');

router.get('/', (req,res) => {
        jsonfile.readFile(myDB, (erro,dados) => {
            if(!erro) res.jsonp(dados)
            else res.json(erro)
        })
})

/* router.get('/:tipo', (req,res) => {
    var purl = url.parse(req.url, true)
    var query = purl.query
    jsonfile.readFile(myDB, (erro,dados) => {
        if(!erro && !query.filtro) res.jsonp(dados.filter((erro, i)=> {
            return dados[i].type==req.params.tipo;
        })) 
        else if (!erro && query.filtro) { res.jsonp(dados.filter)}
        else res.json(erro)
    })
}) */


router.get('/:tipo', (req,res) => {
    jsonfile.readFile(myDB, (erro,dados) => {
        if(!erro) res.jsonp(dados.filter((erro, i)=> {
            return dados[i].type==req.params.tipo;
        }))
        else res.json(erro)
    })
})

module.exports = router;