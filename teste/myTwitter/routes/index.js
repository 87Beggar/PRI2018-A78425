var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */

router.get('/', function(req, res) {
    axios.get('http://127.0.0.1:3000/api/tweets/')
         .then(jdados => {res.render('index', {dados: jdados.data})})
         .catch(erro => {res.render('error', {erro: erro})});
});

router.post('/', (req,res) => {
    console.log("no index" + JSON.stringify(req.body));
    axios.post('http://localhost:3000/api/tweets/', req.body)
         .then(dados => {res.redirect('http://localhost:3000/')})
         .catch(erro => {
            console.log('Erro na inserção do evento: ' + erro)
            res.render('error', {error: erro, message: "Ocorreu um erro na inserção"})
        })
})

module.exports = router;
