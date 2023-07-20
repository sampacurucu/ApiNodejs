const router = require('express').Router();
const conexion = require('../config/conexion');

//gest abogado para verifiar si esta registrado
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



module.exports = router;