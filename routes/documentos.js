const router = require('express').Router()
const conexion = require('../config/conexion')

// asignacion todas las rutas
// rutas.get('/', function(req,res){  //example
//     res.send('hola desde rutas/inicio')
// });
// asignacion todas las rutas

// get de documentos
router.get('/',(req, res)=>{
    let sql = 'select * from documentos'
    conexion.query(sql,(err, rows, fields)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
});

// get de un documento
router.get('/:id',(req, res)=>{
    const {id}=req.params
    let sql = 'select * from documentos where id = ?'
    conexion.query(sql,[id],(err, rows, fields)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
});

//agregar un documento
router.post('/',(req,res)=>{
    const{codigo_juicio,tipo,nombre,descripcion,documento} = req.body

    let sql = `insert into documentos(codigo_juicio,tipo,nombre,descripcion, documento) 
        values('${codigo_juicio}','${tipo}','${nombre}','${descripcion}','${documento}')`
    conexion.query(sql, (err, rows, fields)=>{
        if(err) throw err
        else{
            res.json({status: 'documento agregado'})
        }
    })
});

// eliminar
router.delete('/:id',(req,res)=>{
    const{id} = req.params

    let sql =`delete from documentos where id = '${id}'`
    conexion.query(sql, (err, rows, fields)=>{
        if(err) throw err
        else{
            res.json({status: 'documento eliminado'})
        }
    })
});

//modificar
router.put('/:id',(req, res)=>{
    const{id}=req.params
    const{codigo_juicio,tipo,nombre,descripcion,documento} = req.body

    let sql = `update documentos set
                codigo_juicio ='${codigo_juicio}',
                tipo ='${tipo}',
                nombre ='${nombre}',
                descripcion ='${descripcion}', 
                documento ='${documento}' 
                where id = '${id}'`
    
    conexion.query(sql, (err, rows, fields)=>{
        if(err) throw err
        else{
            res.json({status: 'documento modificado'})
        }
    })

});

module.exports=router;