/* Optional local preview: node preview.js. No external packages required. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const handler=require('./api/quote.js');const root=path.join(__dirname,'public');
const types={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/quote'){
  let body='';for await(const chunk of req){body+=chunk;if(body.length>24000){res.writeHead(413);return res.end('Request too large')}}
  req.body=body;res.status=n=>{res.statusCode=n;return res};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data))};return handler(req,res);
 }
 let name=decodeURIComponent(url.pathname);if(name==='/')name='/index.html';if(!path.extname(name))name+='.html';let file=path.join(root,name);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden')}
 if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){file=path.join(root,'404.html');res.statusCode=404;}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT||4173),'0.0.0.0',()=>console.log('GNS preview on port '+(process.env.PORT||4173)));
