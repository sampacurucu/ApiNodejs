const router = require('express').Router();
const conexion = require('../config/conexion');


// get de documentos
router.get('/allDocumentos',(req, res)=>{
    let sql = 'SELECT * FROM documento';

    conexion.query(sql,(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

// get de un documento
router.get('/oneDocumento/:id',(req, res)=>{
    const {id}=req.params;
    let sql = 'SELECT * FROM documento WHERE id_documento = $1'

  
    conexion.query(sql,[id],(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

//agregar un documento
router.post('/addDocumento',(req,res)=>{
    const{id_juicio,juicio,nombre,descripcion,documento} = req.body;

    let sql = `INSERT INTO documento(id_juicio,juicio,nombre,descripcion,documento) 
        VALUES ($1,$2,$3,$4,$5)`;
    conexion.query(sql, [id_juicio,juicio,nombre,descripcion,documento],(err, rows)=>{
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
    const{id_juicio,juicio,nombre,descripcion,documento} = req.body

    let sql = `UPDATE documento SET
                id_juicio = $1,
                juicio =$2,
                nombre = $3,
                descripcion = $4, 
                documento = $5 
                WHERE id_documento = $6`;
    
    conexion.query(sql, [id_juicio,juicio,nombre,descripcion,documento,id],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'documento modificado'});
        }
    });

});

module.exports=router;