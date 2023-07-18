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

  module.exports = router;
  