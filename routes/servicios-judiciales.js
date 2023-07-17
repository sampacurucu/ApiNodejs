const router = require('express').Router();
const conexion = require('../config/conexion');

router.get('/categorias',(req, res)=>{
    let sql = 'SELECT * FROM categorias_servicios_judiciales';
    
    conexion.query(sql,(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

router.get('/ubicaciones/:id_categoria',(req, res)=>{
    const { id_categoria } = req.params;
    let sql = `SELECT * FROM ubicaciones_servicios_judiciales WHERE id_categoria=${id_categoria}`;
    
    conexion
    conexion.query(sql,(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

module.exports=router;