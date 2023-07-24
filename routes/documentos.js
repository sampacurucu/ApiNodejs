const router = require('express').Router();
const conexion = require('../config/conexion');
const multer = require('multer');

// Configurar multer para guardar los archivos en una carpeta temporal
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos'); // Carpeta temporal llamada "tempUploads"
    },
    filename: function (req, file, cb) {
    //   cb(null, file.originalname); // Mantener el nombre original del archivo
        // Obtener el nombre del archivo sin extensión
        const filenameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
        const ext = file.originalname.split('.').pop(); // Obtener la extensión del archivo

        // Generar un nombre único agregando un timestamp al nombre original
        const uniqueFilename = `${filenameWithoutExt}-${Date.now()}.${ext}`;

        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage });

// get de documentos  de un abogado
router.get('/allDocumentos/',async (req, res)=>{
    // router.get('/allDocumentos/:idA',(req, res)=>{
    // const{idA}=req.params;
    const idA=req.sesion?.idUsuario;
    let sql = `SELECT d.* 
        FROM documento d
        JOIN abogado a ON a.id_abogado = d.id_abogado
        WHERE a.id_abogado = $1
    `;
    

    conexion.query(sql,[idA],(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});


// get de un documento
router.get('/oneDocumento/:id',(req, res)=>{
    const {id}=req.params;
    let sql = `SELECT * FROM documento WHERE id_documento = $1`

  
    conexion.query(sql,[id],(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});


// eliminar
router.delete('/deleteDocumento/:id',(req,res)=>{
    const{id} = req.params;

    let sql =`DELETE FROM documento where id_documento = $1`;
    conexion.query(sql, [id],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'documento eliminado'});
        }
    });
});

//modificar
router.put('/updateDocumento/:id',(req, res)=>{
    const{id}=req.params
    const{tipo,nombre,descripcion} = req.body

    let sql = `UPDATE documento SET
                tipo = $1,
                nombre = $2,
                descripcion = $3
                WHERE id_documento = $4
            `;
    
    conexion.query(sql, [tipo,nombre,descripcion,id],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'documento modificado'});
        }
    });

});

//para obtener los datos del abogado una vez que inicia sesion
// router.get('/obtenerAbogado/:email', (req, res) => {
//     const emailAbog = req.params.email;
  
//     let sql = `
//         SELECT *
//         FROM abogado
//         WHERE email = $1
//     `;
  
//     conexion.query(sql, [emailAbog], (err, result) => {
//       if (err) throw err;
//       else {
//         res.json(result.rows);
//       }
//     });
// });


router.post('/addDocumento', upload.single('documento'), (req, res) => {
    // const { id_abogado, tipo, nombre, descripcion } = req.body;
    const {tipo, nombre, descripcion } = req.body;
    const documento = req.file; // Obtener el archivo subido desde req.file
    const id_abogado = req.sesion?.idUsuario;
    let sql = `INSERT INTO documento(id_abogado, tipo, nombre, descripcion, documento) 
      VALUES ($1, $2, $3, $4, $5)`;
  
    // Aquí puedes manejar el archivo "documento" de la forma que desees, ya sea guardándolo directamente
    // En este ejemplo, simplemente almacenamos el nombre del archivo en la base de datos.
    // const nombreArchivo = documento ? documento.originalname : null;
    const nombreArchivo = documento ? documento.filename : null;
  
    conexion.query(sql, [id_abogado, tipo, nombre, descripcion, nombreArchivo], (err, rows) => {
      if (err) throw err
      else {
        res.json({ status: 'documento agregado' });
      }
    });
});

router.put('/updateDocumentoFile/:id',upload.single('documento'),(req, res)=>{
    const{id}=req.params;
    const{tipo,nombre,descripcion} = req.body;
    const documento = req.file;

    const nombreArchivo = documento ? documento.filename : null;
    let sql = `UPDATE documento SET
                tipo = $1,
                nombre = $2,
                descripcion = $3,
                documento = $4
                WHERE id_documento = $5
            `;
    
    conexion.query(sql, [tipo,nombre,descripcion,nombreArchivo,id],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'documento modificado'});
        }
    });

});

const path = require('path');

// Función para obtener la ruta del archivo a partir del nombre
function obtenerRutaArchivoPorNombre(nombreArchivo) {
  // Suponiendo que los archivos están en la carpeta 'documentos' dentro del directorio actual
  const carpetaDocumentos = path.join(__dirname, '..', 'documentos');

  // Unir la carpeta con el nombre del archivo para obtener la ruta completa
  const rutaArchivo = path.join(carpetaDocumentos, nombreArchivo);

  return rutaArchivo;
}

// Agregar una nueva ruta para descargar documentos por su nombre
router.get('/downloadDocumento/:nombreArchivo', (req, res) => {
    const { nombreArchivo } = req.params;
  
    // Lógica para obtener la ruta del archivo en el servidor a partir del nombre del archivo
    const rutaArchivo = obtenerRutaArchivoPorNombre(nombreArchivo);
  
    // Enviar el archivo como respuesta
    res.download(rutaArchivo, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        // res.status(404).json({ error: 'El archivo no se encontró o no se puede descargar.' }); 
      }else{
        console.log(res);
        res.status(200).end();
      }
    });
});

module.exports=router;