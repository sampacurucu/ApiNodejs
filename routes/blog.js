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


module.exports = router;