const router = require('express').Router();
const conexion = require('../config/conexion');

// ADD blog
router.post('/addBlog',(req,res)=>{
    // const{id_abogado,titulo,imagen,cuerpo}= req.body;
    const{titulo,imagen,cuerpo}= req.body;

    const id_abogado=req.sesion?.idUsuario;
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

//para obtener los datos del abogado una vez que inicia sesion
router.get('/obtenerAbogado/', (req, res) => {
    // const emailAbog = req.params.email;
    const idAbog=req.sesion?.idUsuario;
    let sql = `
        SELECT *
        FROM abogado
        WHERE id_abogado = $1
    `;
  
    conexion.query(sql, [idAbog], (err, result) => {
      if (err) throw err;
      else {
        res.json(result.rows);
      }
    });
  });


module.exports = router;