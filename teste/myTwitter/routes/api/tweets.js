var express = require('express');
var router = express.Router();
var Tweet = require('../../controllers/tweet')

router.get('/', (req,res) => {
    Tweet.getTweets()
         .then(dados => {/* Tweet.addGostos(dados._id); */ res.jsonp(dados)})
         .catch(erro => res.status(500).send('Erro na listagem: ' + erro));
})

router.post('/', (req,res) => {
    console.log("no tweets"+ JSON.stringify(req.body));
    Tweet.inserir(req.body)
         .then(dados => res.jsonp(dados))
         .catch(erro => res.status(500).send('Erro na inserção: ' + erro));
})

module.exports = router;