const router = require('express').Router();
const conexion = require('../config/conexion');

//GET abogado para verifiar si esta registrado
// por lo tanto puede comentar
router.get('/datosAbogado/:email', (req, res) => {
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

  //ADD comentario
router.post('/addComentario',(req,res)=>{
  const{id_blog,id_abogado,email,cuerpo} = req.body;

  let sql = `INSERT INTO comentario(id_blog,id_abogado,email,cuerpo) 
      VALUES ($1,$2,$3,$4)`;
  conexion.query(sql, [id_blog,id_abogado,email,cuerpo],(err, rows)=>{
      if(err) throw err
      else{
          res.json({status: 'comentario agregado'});
      }
  });
});

// GET comentarios de una blog
router.get('/comentariosBlog/:idB', (req, res) => {
  const idBlog = req.params.idB;

  let sql = `
    SELECT c.*, a.nombres, a.apellidos
    FROM comentario c
    JOIN abogado a ON c.id_abogado = a.id_abogado
    WHERE c.id_blog = $1 
  `;

  conexion.query(sql, [idBlog], (err, result) => {
    if (err) throw err;
    else {
      res.json(result.rows);
    }
  });
});

//verificar si le pertenece un comentario
router.get('/comentarioAbogado/:idComentario/:idBlog/:idAbogado/:email', (req, res) => {
  const { idComentario,idBlog, idAbogado, email } = req.params;

  const sql = `
    SELECT *
    FROM comentario
    WHERE id_comentario = $1
      AND id_blog = $2
      AND id_abogado = $3
      AND email = $4
  `;

  conexion.query(sql, [idComentario,idBlog, idAbogado, email], (err, result) => {
    if (err) throw err;
    else {
      res.json(result.rows);
    }
  });

});

// eliminar comentario
router.delete('/eliminarComment/:idComment/:idBlog',(req,res)=>{
  const{idComment,idBlog} = req.params;

  let sql =`DELETE FROM comentario where id_comentario = $1
  AND id_blog = $2
  `;
  conexion.query(sql, [idComment,idBlog],(err, rows)=>{
      if(err) throw err;
      else{
          res.json({status: 'comentario eliminado'});
      }
  });
});
  




module.exports = router;