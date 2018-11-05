var express = require('express')
var http = require('http')
var logger = require('morgan')
var fs = require('fs')
var pug = require('pug')
var formidable = require('formidable')
var jsonfile = require('jsonfile')
var url = require('url')

var myDB = "JSON/files.json"
var app = express()

app.use(logger('combined'))

app.post('/processaForm', (req,res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=> {
        if(files.ficheiro.size!=0) {
            jsonfile.readFile(myDB, (erro,ficheiros)=>{
                if(!erro) {
                    var fenviado = files.ficheiro.path
                    var fnovo = '/uploaded/file'+ficheiros.length
                    var novo = {'link':fnovo, 
                                'nome':files.ficheiro.name, 
                                'descricao': fields.desc,
                                'type': files.ficheiro.type}
                    console.log("files: " + JSON.stringify(files))
                    console.log("fields: "+ JSON.stringify(fields))            
                    ficheiros.push(novo)
                    jsonfile.writeFile(myDB,ficheiros, erro2 =>{
                        if(!erro2) {
                            console.log("Registo gravado com sucesso")
                            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                            res.write(pug.renderFile('lista.pug', {ficheiros: ficheiros}))
                            res.end()
                        } else console.log("Erro a escrever em myDB: " + erro2)
                    })  
                    fs.rename(fenviado, "uploaded/"+fnovo.split('/')[2], erro => {
                        if(!erro) {
                            console.log("rename feito com sucesso")
                        } else {
                            console.log("e: Ocorreram erros na gravação do ficheiro enviado: "+ erro)
                        }
                    })
                } 
            })
        } else {        
            jsonfile.readFile(myDB, (erro,ficheiros)=>{
                if(!erro) {
                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    res.write(pug.renderFile('lista.pug', {ficheiros: ficheiros}))
                    res.end()
                } else {
                    res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
                    res.end('<p>Ocorreu um erro no servidor</p>')
                    console.log("Erro a ler myDB: " + erro)
                }
            })
        }
    })
})

app.get('/w3.css', (req,res) => {
    fs.readFile('stylesheets/w3.css', (erro, dados)=> {
        if(!erro) {
            res.writeHead(200, {'Content-Type':'text/css'})
            res.write(dados)
        } else {
            res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
            res.write(pug.renderFile('erro.pug', {e: erro}))
        }
        res.end()
    })
})

app.get('/uploaded/*', (req,res) => {
    var purl = url.parse(req.url)
    jsonfile.readFile(myDB, (erro,ficheiros)=>{
        if(!erro) {
            var objetoPretendido=ficheiros.filter(objetivo=>objetivo.link==purl.pathname)[0]
            console.log("vou abrir o ficheiro: ."+objetoPretendido.link)
            fs.readFile(("uploaded/"+objetoPretendido.link.split("/")[2]), (erro,dados) => {
                if(!erro) {
                    console.log("abri o ficheiro: "+("uploaded/"+objetoPretendido.link.split("/")[2]))
                    res.writeHead(200,{'Content-Type':objetoPretendido.type+';charset=utf-8'})
                    res.end(dados)
                } else {
                    res.writeHead(500,{'Content-Type':'text/html;charset=utf-8'})
                    console.log("ocorreu o erro: "+ erro)
                    res.end("Ocorreu um erro na leitura do ficheiro")
                }
            })
        } 
    })
})

app.get('/jquery-3.3.1.min.js', (req,res) => {
    var purl=url.parse(req.url)
    fs.readFile(purl.pathname.split('/')[1], (erro,dados) => {
        if(!erro) {
            res.writeHead(200,{'Content-Type':'application/x-javascript'})
            res.write(dados)
            res.end()
        } else {
            res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
            res.end('Ocorreu um erro a ler jquery min')
        }
    })
})


app.get('/reset.js', (req,res) => {
    var purl=url.parse(req.url)
    fs.readFile(purl.pathname.split('/')[1], (erro,dados) => {
        if(!erro) {
            res.writeHead(200,{'Content-Type':'application/x-javascript'})
            res.write(dados)
            res.end()
        } else {
            res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
            res.end('Ocorreu um erro a ler resetJS')
        }
    })
})

app.get('/myJS.js', (req,res) => {
    var purl=url.parse(req.url)
    fs.readFile(purl.pathname.split('/')[1], (erro,dados) => {
        if(!erro) {
            res.writeHead(200,{'Content-Type':'application/x-javascript'})
            res.write(dados)
            res.end()
        } else {
            res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
            res.end('Ocorreu um erro a ler myJS')
        }
    })
})

app.all("/", (req,res) => {
    jsonfile.readFile(myDB, (erro,ficheiros)=>{
        if(!erro) {
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            res.write(pug.renderFile('lista.pug', {ficheiros: ficheiros}))
            res.end()
        } else {
            res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
            res.end('<p>Ocorreu um erro no servidor</p>')
            console.log("Erro a ler myDB: " + erro)
        }
    })
})



http.createServer(app).listen(7000)