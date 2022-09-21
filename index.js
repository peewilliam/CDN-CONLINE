const express = require('express');
const ExpressApp = express();
const http = require('http');
const path = require('path');
const formidable = require("formidable");
const server = http.createServer(ExpressApp);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
const port = 2828;
const sharp = require("sharp");

ExpressApp.use(express.urlencoded({extended: true}));
ExpressApp.use(express.json());
ExpressApp.use('/', express.static(path.join(__dirname, 'arquivos')))

async function compressImage(file, local) {
 
    try {
      const metadata = await sharp(file)
      .toFormat('webp')
      .webp({
            quality: 80
        })
      .toFile(local);
       fs.access(file, (err) => {
        if (!err) {
            fs.unlink(file, err_1 => {
                if (err_1)
                    console.log(err_1);
            });
        }
    });
    } catch (error) {
      console.log(`An error occurred during processing: ${error}`);
    }
  }

ExpressApp.post('/CadImgColaborador', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
    //     console.log(fields)
    // console.log(req.body)
    console.log(files)
    var extensaoArquivo;
    var newpath;
    var oldpath
    extensaoArquivo = files.toUpload.originalFilename.split('.')[1];
      oldpath = files.toUpload.filepath;
  
      newpath = path.join(__dirname, 'arquivos/colaboradores', files.toUpload.originalFilename);
    
  
      fs.renameSync(oldpath, newpath);

     res.sendStatus(200)
    })

})


server.listen(port, () => {
  
    console.log(`Servidor backend executado: http://localhost:${port}`);
    
    
  });