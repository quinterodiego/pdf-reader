const express = require('express');
// const multer = require('multer');
const fs = require("fs");
const { PdfReader } = require("pdfreader");
// const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// let storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'c:/temp');
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// let upload = multer({ storage: storage })

// console.log(upload.storage.getFilename)

// app.post('/api/rename', upload.array('myFiles', 12), (req, res, next) => {
//     const files = req.files;
//     if(!files) {
//         const error = new Error('Elija al menos un archivo');
//         error.httpStatusCode = 400;
//         return next(error);
//     }
//     res.send({
//         archivos: files
//     })
// });

app.get('/api/rename/pdfs/:anio/:mes/:dia', async (req, res) => {
    const { anio, mes, dia } = req.params
    const fileNames = await fs.readdirSync(`\\\\daredevil-cl\\Documentos\\Fin\\${anio}\\${mes}\\${dia}`);
    const fileNamesToLowerCase = fileNames.map(file => file.toLocaleLowerCase())
    const nuevoArray = await fileNamesToLowerCase.filter((file) => file.match('.pdf'))
    console.log(nuevoArray)
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
        readFile(`\\\\daredevil-cl\\Documentos\\Fin\\${anio}\\${mes}\\${dia}\\${i}`)
            .then(result =>{
                if(result[1] === 'Comitente' && result[10] === 'B O L E T O' && result[18].substring(0, 8) === 'Especie:') {
                    fs.rename(`\\\\daredevil-cl\\Documentos\\Fin\\${anio}\\${mes}\\${dia}\\${i}`, `\\\\daredevil-cl\\Documentos\\Fin\\${anio}\\${mes}\\${dia}\\bo${pad(result[17], 8)}.pdf`, function
                    (err) {
                        if ( err ) console.log('ERROR: ' + err)
                    });
                } else if (result[21].includes('LIQUIDACION') && result[21].includes('CUOTAPARTES')) {
                    fs.rename(`\\\\daredevil-cl\\Documentos\\Fin\\${anio}\\${mes}\\${dia}\\${i}`, `\\\\daredevil-cl\\Documentos\\Fin\\${anio}\\${mes}\\${dia}\\fci${pad(result[22].slice(16, 24), 8)}.pdf`, function
                    (err) {
                        if ( err ) console.log('ERROR: ' + err)
                    });
                } else {
                    console.log('No boleto o fci')
                }
            })
    });

    res.json({ message: 'Proceso terminado' })
})


const PORT = 7832;
// 1 comitente, 10 Boleto, 18
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));