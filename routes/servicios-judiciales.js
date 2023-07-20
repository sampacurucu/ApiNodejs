const router = require('express').Router();
const conexion = require('../config/conexion');

router.get('/categorias',(req, res)=>{
    const sql = 'SELECT * FROM categorias_servicios_judiciales';
    
    conexion.query(sql,(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

router.get('/ubicaciones/:id_categoria',(req, res)=>{
    const { id_categoria } = req.params;
    const sql = `select c.icono, u.* 
                from ubicaciones_servicios_judiciales u 
                inner join categorias_servicios_judiciales c 
                on u.id_categoria=c.id 
                where u.id_categoria=$1`
    
    
    conexion
    conexion.query(sql,[id_categoria],(err, result)=>{
        if(err) throw err;
        else{
            res.json(result.rows);
        }
    });
});

module.exports=router;