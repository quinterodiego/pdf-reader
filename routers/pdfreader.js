const express = require('express');
const { Router } = express;
const fs = require("fs");
const { PdfReader } = require("pdfreader");

const router = Router();

router.post('/api/rename', (req, res) => {
    const fileNames = fs.readdirSync('c:/temp/pdfs/');
    const nuevoArray = fileNames.filter((file) => file.match('.pdf'))

    function readFile(file){
        const arr = []
        return new Promise(function(resolve, reject){
            new PdfReader().parseFileItems(file, function(err, item) {
            if (err) reject(err);
            else if (!item) resolve();
            else if (item.text) {
                arr.push(item.text.trim())
                resolve(arr);
            }
            });
        })
    }

    function pad(n, width, z) { 
        z = z || '0'; 
        n = n + ''; 
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n; 
    }

    nuevoArray.forEach((i, index) => {    
        readFile(i)
            .then(result =>{
                fs.rename(`./${i}`, `./bo${pad(result[17], 8)}.pdf`, function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
            })
    });

    res.send({
        message: 'OK'
    })
});

module.exports = router;