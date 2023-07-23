const router = require('express').Router();
const conexion = require('../config/conexion');


// get de documentos  de un abogado
router.get('/allDocumentos/:idA',(req, res)=>{
    const{idA}=req.params;
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

//agregar un documento
router.post('/addDocumento',(req,res)=>{
    const{id_abogado,tipo,nombre,descripcion,documento} = req.body;

    let sql = `INSERT INTO documento(id_abogado,tipo,nombre,descripcion,documento) 
        VALUES ($1,$2,$3,$4,$5)`;
    conexion.query(sql, [id_abogado,tipo,nombre,descripcion,documento],(err, rows)=>{
        if(err) throw err
        else{
            res.json({status: 'documento agregado'});
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
    const{tipo,nombre,descripcion,documento} = req.body

    let sql = `UPDATE documento SET
                tipo = $1,
                nombre = $2,
                descripcion = $3, 
                documento = $4 
                WHERE id_documento = $5
            `;
    
    conexion.query(sql, [tipo,nombre,descripcion,documento,id],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'documento modificado'});
        }
    });

});

//para obtener los datos del abogado una vez que inicia sesion
router.get('/obtenerAbogado/:email', (req, res) => {
    const emailAbog = req.params.email;
  
    let sql = `
        SELECT *
        FROM abogado
        WHERE email = $1
    `;
  
    conexion.query(sql, [emailAbog], (err, result) => {
      if (err) throw err;
      else {
        res.json(result.rows);
      }
    });
});

module.exports=router;