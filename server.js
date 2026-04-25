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