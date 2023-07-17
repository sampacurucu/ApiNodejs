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

module.exports=router;