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
const mysql = require('promise-mysql');

const connection = mysql.createConnection({
  host: '144.22.225.253',
  user: 'aplicacao',
  port: "3306",
  password: 'conline@2510A',
  database: 'SIRIUS',
  charset: "utf8mb4"
});

function getConnection() {
  return connection;
}

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

 ExpressApp.post('/CadWallpapper', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        console.log(files)
    // console.log(req.body)
   
    var extensaoArquivo;
    var newpath;
    var oldpath
    extensaoArquivo = files.toUpload.originalFilename.split('.')[1];
      oldpath = files.toUpload.filepath;
  
      newpath = path.join(__dirname, 'arquivos/Wallpapper', 'wallpapper.webp');
    
  
      fs.renameSync(oldpath, newpath);

     res.sendStatus(200)
    })

})

ExpressApp.get('/Wallpapper', async (req, res) => {
  
res.sendFile(path.join(__dirname, 'arquivos/Wallpapper', 'wallpapper.webp'));
   
})

ExpressApp.post('/CadImgColaborador', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
    //     console.log(fields)
    // console.log(req.body)
   
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

ExpressApp.get('/consultaColab', async (req, res) => {
  var id_head = req.query.id;
  console.log(id_head)

  const conn = await getConnection();
  var sql = `SELECT * FROM colaboradores WHERE id_colab_head = ${id_head} LIMIT 1`

  conn.query(sql, function(err2, results){
    if(results.length > 0){
      res.sendFile(path.join(__dirname, 'arquivos/colaboradores', results[0].id_colaboradores+'.webp'));
    }else{
      res.send('erro')
      
    }
    
  })
})

ExpressApp.post('/CadImgAssinatura', async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
  //     console.log(fields)
  // console.log(req.body)

  var extensaoArquivo;
  var newpath;
  var oldpath
  extensaoArquivo = files.toUpload.originalFilename.split('.')[1];
    oldpath = files.toUpload.filepath;

    newpath = path.join(__dirname, 'arquivos/assinaturas', files.toUpload.originalFilename);
  

    fs.renameSync(oldpath, newpath);

   res.sendStatus(200)
  })

})

ExpressApp.get('/assinatura', async (req, res) => {
  var ref_ass = req.query.ref;
 
  if(ref_ass == 'LOGO'){
    res.sendFile(path.join(__dirname, 'arquivos/assinaturas', 'LOGO.webp'));
  }else if(ref_ass == 'GRUPOS'){
    res.sendFile(path.join(__dirname, 'arquivos/assinaturas', 'GRUPOS.webp'));
  }else if(ref_ass == 'AVISOS'){
    res.sendFile(path.join(__dirname, 'arquivos/assinaturas', 'AVISOS.webp'));
  }else if(ref_ass == 'SIRIUS'){
    res.sendFile(path.join(__dirname, 'arquivos/assinaturas', 'SIRIUS.webp'));
  }else{
    const conn = await getConnection();
    var sql = `SELECT * FROM colaboradores WHERE ref_ass = '${ref_ass}' LIMIT 1`
  
    conn.query(sql, function(err2, results){
      if(results.length > 0){
        res.sendFile(path.join(__dirname, 'arquivos/assinaturas', results[0].id_colaboradores+'.webp'));
      }else{
        res.send('erro')
        
      }
      
    })
  }

  
})
  // res.send('ok')

  

  // setInterval(() => {
  //   io.emit('att_tabela', 'tabela_controleSenhas');
  // }, 1000);

io.on("connection", async (socket) => {

    console.log('nova conexão')

    socket.on('att_tabela', async function(msg) {
      console.log('tabela atualizado', msg)
      await io.emit('att_tabela', msg);
    
    });
    
    socket.on('parametros', async function(param) {
      console.log('novo parametro', param)
      await io.emit(param.adress, param.param);
      
    });
    

});




  
  

server.listen(port, () => {
  
    console.log(`Servidor backend executado: http://localhost:${port}`);
 
  });