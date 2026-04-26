const http=require('http');
const fs=require('fs');

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
        res.setHeader('Content-type', 'application/json');
})
if(method==='GET'&& url==='/movies'){
    return readdata((movies)=>{
        res.writeHead(200);
        res.end(JSON.stringify(movies));
    });
}
if (method==='GET'&& url.startsWith('/movies/')){
    const id=Number(url.split('/')[2]);
    return readdata((movies)=>{
        const movie=movies.find(m=>m.id===id);
        if(!movie){
        res.writeHead(404);
        res.end(JSON.stringify(movie ||
            {
            message:'movie not found'}));
        }
    });
}
if(method==='POST'&& url==='/movies'){
    let body='';
    req.on('data', chunk=>body+=chunk);
    req.on('end', ()=>{
        const newmovie=JSON.parse(body);
        if(
            !newmovie.title|| !newmovie.review|| !newmovie.rating !== 'number'||newmovie.rating<1||newmovie.rating>10
        ){
            res.writeHead(400);
            return res.end(JSON.stringify({
                message:'rating should be between 1 and 10'
            }));
        }
        readdata((movies)=>{
            newmovie.id=Date.now();
            movies.push(newmovie);
            writedata(movies, ()=>{
                res.writeHead(201);
                res.end(JSON.stringify(newmovie));
            });
        });
    });
}
if(method==='put'&&url.startswith('/movies/')){
    const id=Number(url.split('/')[2]);
    let body='';
    req.on('data', chunk=> body+=chunk);
    req.on('end', ()=>{
        const updateddata=JSON.parse(body);
        if(
           updateddata.rating !==undefined&&(updateddata.rating<1||updateddata.rating>10) 
        ){
            res.writeHead(400);
            return res.end(JSON.stringify({
                message:'rating should be between 1 and 10'
            }));
        }
        readdata((movies)=>{
            const index=movies.findIndex(m=>m.id===id);
            if(index===-1){
                res.writeHead(404);
                return res.end(JSON.stringify({
                    message:'movie not found'
                }));
            }
            movies[index]={
                id:movies[index].id,
                title:updateddata.title||movies[index].title,
                review:updateddata.review||movies[index].review,
                rating:updateddata.rating||movies[index].rating
            };
            writedata(movies,()=>{
                res.writeHead(200);
                res.end(JSON.stringify(movies[index]));
            });
        });
    });
}
if(method==='delete'&&url.startswith('/movies/')){
    const id=Number(url.split('/')[2]);
    readdata((movies)=>{
        const filtered=movies.filter(m=>m.id!==id);
        writedata(filtered, ()=>{
            res.writeHead(200);
            res.end(JSON.stringify({
                message:'deleted successfully'
            }));
        });
    });
}
res.writeHead(404);
res.end(JSON.stringify({
    message:'route not found'
}));
server.listen(PORT, ()=>{
    Console.log('server running on http://localhost:${PORT}');
});