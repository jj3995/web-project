const http=require('http');
const fs=require('fs');
const { error } = require('console');

const PORT=4000;
const FILE='./movies.json';
 function readdata(callback){
fs.readFile(FILE, 'utf-8', (error, data)=>{
    if(error) return callback([]);
    try{
        callback(JSON.parse(data || '[]'));
    }
    catch(e){
        callback([]);
    }
});
}
function writedata(data, callback){
    fs.writeFile(FILE, JSON.stringify(data, null, 2), callback);
}
const server= http.createServer((req, res)=>{
    const{
        method, url}=req;
        res.setHeader('content-type', 'application/json');
})
if(method==='get'&& url==='/movies'){
    return readdata((movies)=>{
        res.writehead(200);
        res.end(JSON.stringify(movies));
    });
}
if (method==='get'&& url.startswith('/movies/')){
    const id=Number(url.split('/')[2]);
    return readdata((movies)=>{
        const movie=movies.find(m=>m.id===id);
        res.writehead(200);
        res.end(JSON.stringify(movie ||
            {
            message:'movie not found'}));
    });
}
if(method==='post'&& url==='/movies'){
    let body='';
    req.on('data', chunk=>body+=chunk);
    req.on('end', ()=>{
        const newmovie=JSON.parse(body);
    })
}