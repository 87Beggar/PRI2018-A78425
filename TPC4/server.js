var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer((req,res)=>{
    
    var purl = url.parse(req.url,true)
    console.log(purl)
    var p = purl.pathname
    console.log(p)
    var q = purl.query

    if(p=="/obras") {
        fs.readFile(("./website/html/obra"+q.id+".html"), (err,dados) => {
            res.writeHead(200,{'Content-Type':'text.html'})
            if(!err) 
                res.write(dados)
            else 
                res.write(err)
            res.end()
        })
    } else if (p=="/"||p=="/obra") {
        fs.readFile(("./website/index.html"), (err,dados) => {
            res.writeHead(200,{'Contente-Type':'text.html'})
            if(!err)
                res.write(dados)
            else 
                res.write(err)
            res.end()
        })
    } else {
        res.writeHead(200,{'Content-Type':'text.html'})
        res.write("<html>\n\t<head><meta charset=\"UTF-8\"></head>\n\t<body>\n\t\t<h1>ERRO 404 NOT FOUND</h1>\n\t</body>\n</html>")
        res.end()
    }
}).listen(4004,()=>{
    console.log('Servidor à escuta na porta 4004...')
})