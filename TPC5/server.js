var http = require('http')
var url = require('url')
var fs = require('fs')
var pug = require('pug')
var parser = require('xml2json')

var estilo = /w3\.css/g
var index = /index/g
var obra = /obra/g

var ficheiros = fs.readdirSync('data/json') 
var str="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<index>"
fs.writeFileSync("data/index.xml",str)
for(var x=0, l=ficheiros.length+1;x<l;x++) {
    if(x<(l-1)) {
        console.log("data/json/"+ficheiros[x])
        fs.readFile("data/json/"+ficheiros[x], (erro,dados) => {
            if(!erro) {
                console.log("li sem erros")
                var myObj=JSON.parse(dados)
                fs.appendFileSync("data/index.xml", "\n<obra>\n<id>" + myObj._id + "</id>\n<titulo>" + myObj.titulo + "</titulo>\n</obra>")
            } else {
                console.log("morri")
            }
        })
    } else {
        setTimeout(()=>{
            fs.appendFileSync("data/index.xml", "\n</index>")
        },5000)
    }
}


http.createServer((req,res)=>{
    var purl = url.parse(req.url,true);

    if(index.test(purl.pathname)) {
        console.log("reconheceu index")
        res.writeHead(200,{'Content-Type':'text/html'})
        fs.readFile("data/index.xml", (erro,dados)=> {
            if(!erro) {
                var finalObj = JSON.parse(parser.toJson(dados))
                console.log(JSON.stringify(finalObj))
                res.write(pug.renderFile('index.pug', {ind: finalObj}))     
            } else {
                console.log(erro)
            }
            res.end()
        })     
    } else if(estilo.test(purl.pathname)) {
        res.writeHead(200,{'Content-Type':'text/css'})
        fs.readFile('estilo/w3.css', (erro,dados) => {
            if(!erro) {
                res.write(dados)
            }
            else 
                res.write("<p><b>ERRO: </b></p>")
            res.end()
        })
    } else if(obra.test(purl.pathname)) {
        var ficheiro = purl.pathname.split('/')[2]+".json"
        console.log('Lendo o ficheiro: ' + ficheiro)        
        fs.readFile('data/json/'+ficheiro, (erro,dados) => {
            if(!erro) {
                var myObj = JSON.parse(dados);
                res.write(pug.renderFile('template.pug', {obra: myObj}))
            }
            else 
                res.write("<p><b>ERRO: </b> " + erro + "</p>")
            res.end()
        })
    } else { 
        res.end()
    } 
}).listen(5555, ()=>{
    console.log('Servidor à escuta na porta 5555...')
})