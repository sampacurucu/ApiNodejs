const router = require('express').Router();
const conexion = require('../config/conexion');

// ADD blog
router.post('/addBlog',(req,res)=>{
    const{id_abogado,titulo,imagen,cuerpo}= req.body;

    let sql = `INSERT INTO blog(id_abogado,titulo,imagen,cuerpo)
        VALUES ($1,$2,$3,$4) 
    `;
    conexion.query(sql,[id_abogado,titulo,imagen,cuerpo],(err,rows) => {
        if(err) throw err
        else{
            res.json({status: 'blog agregado'})
        }
    });
});

module.exports = router;