const router = require('express').Router();
const conexion = require('../config/conexion');

// asignacion todas las rutas
// rutas.get('/', function(req,res){  //example
//     res.send('hola desde rutas/inicio')
// });
// asignacion todas las rutas

// get de documentos
router.get('/',(req, res)=>{
    let sql = 'SELECT * FROM documentos';
    // let sql = 'SELECT id, codigo_juicio, tipo, nombre, descripcion, documento FROM documentos';
    conexion.query(sql,(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

// get de un documento
router.get('/:id',(req, res)=>{
    const {id}=req.params;
    let sql = 'SELECT * FROM documentos WHERE id = $1'
    // let sql = 'SELECT id, codigo_juicio, tipo, nombre, descripcion, documento FROM documentos WHERE id = $1';
  
    conexion.query(sql,[id],(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

//agregar un documento
router.post('/',(req,res)=>{
    const{codigo_juicio,tipo,nombre,descripcion,documento} = req.body;

    let sql = `INSERT INTO documentos(codigo_juicio,tipo,nombre,descripcion, documento) 
        VALUES ($1,$2,$3,$4,$5)`;
    conexion.query(sql, [codigo_juicio,tipo,nombre,descripcion,documento],(err, rows)=>{
        if(err) throw err
        else{
            res.json({status: 'documento agregado'});
        }
    });
});

// eliminar
router.delete('/:id',(req,res)=>{
    const{id} = req.params;

    let sql =`DELETE FROM documentos where id = $1`;
    conexion.query(sql, [id],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'documento eliminado'});
        }
    });
});

//modificar
router.put('/:id',(req, res)=>{
    const{id}=req.params
    const{codigo_juicio,tipo,nombre,descripcion,documento} = req.body

    let sql = `UPDATE documentos SET
                codigo_juicio = $1,
                tipo =$2,
                nombre = $3,
                descripcion = $4, 
                documento = $5 
                WHERE id = $6`;
    
    conexion.query(sql, [codigo_juicio,tipo,nombre,descripcion,documento,id],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'documento modificado'});
        }
    });

});

module.exports=router;