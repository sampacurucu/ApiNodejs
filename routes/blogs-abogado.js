const router = require('express').Router();
const conexion = require('../config/conexion');

// GET de blogs con nombres de abogados
router.get('/blogsconAbog', (req, res) => {
    let sql = `
        SELECT b.*, a.nombres, a.apellidos
        FROM blog b
        JOIN abogado a ON b.id_abogado = a.id_abogado
    `;
  
    conexion.query(sql, (err, result) => {
      if (err) throw err;
      else {
        res.json(result.rows);
      }
    });
  });

// GET de un solo blog con nombre del abogado
router.get('/blogIndividualconAbog/:id', (req, res) => {
    const idBlog = req.params.id;
  
    let sql = `
        SELECT b.*, a.nombres, a.apellidos
        FROM blog b
        JOIN abogado a ON b.id_abogado = a.id_abogado
        WHERE b.id_blog  = $1
    `;
  
    conexion.query(sql, [idBlog], (err, result) => {
      if (err) throw err;
      else {
        res.json(result.rows);
      }
    });
  });

  //agregar los me gusta a blog
router.put('/blogLike/:idBlog',(req, res)=>{
  const{idBlog}=req.params

  let sql = `UPDATE blog
      SET megusta = megusta + 1
      WHERE id_blog = $1
    `;
  
  conexion.query(sql, [idBlog],(err, rows)=>{
      if(err) throw err;
      else{
          res.json({status: 'like aumentado'});
      }
  });

});

  //agregar los no me gusta a blog
  router.put('/blogDislike/:idBlog',(req, res)=>{
    const{idBlog}=req.params
  
    let sql = `UPDATE blog
        SET nomegusta = nomegusta + 1
        WHERE id_blog = $1
      `;
    
    conexion.query(sql, [idBlog],(err, rows)=>{
        if(err) throw err;
        else{
            res.json({status: 'dislike aumentado'});
        }
    });
  
  });

  // get de like y dislike
router.get('/blogLikeDislike/:idBlog',(req, res)=>{
  const {idBlog}=req.params;
  let sql = `SELECT meGusta, noMeGusta
    FROM blog
    WHERE id_blog = $1
  `;

  conexion.query(sql,[idBlog],(err, result)=>{
      if(err) throw err;
      else{
          res.json(result.rows);
      }
  });
});


  module.exports = router;
  